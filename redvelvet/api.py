from http import HTTPStatus
from functools import wraps
from urllib.parse import urlparse

from sanic import Blueprint, response
from aioredis.errors import ReplyError

from redvelvet import util


blueprint = Blueprint('API')


def with_redis_connection(fn):
    @wraps(fn)
    async def wrapper(request, connection_label, *args, **kwargs):
        try:
            redis = request.app.redis_connections[connection_label]
        except KeyError:
            err = {'error': f'Redis connection label unrecognized: {connection_label}'}
            return response.json(err, status=HTTPStatus.NOT_FOUND)

        try:
            return await fn(request, redis, *args, **kwargs)
        except TimeoutError:
            redis = await util.reconnect_to_redis(request.app, connection_label)
            return await fn(request, redis, *args, **kwargs)
    return wrapper


@blueprint.route('/connections', frozenset({'GET'}))
async def get_connections(request):
    uris = []
    for redis_uri in request.app.config.REDIS_URIS:
        uri = urlparse(redis_uri.uri)
        uris.append({'label': redis_uri.label, 'uri': f'{uri.hostname}:{uri.port or 6379}'})

    return response.json(uris)


@blueprint.route('/connections/<connection_label>/keys', frozenset({'GET'}))
@with_redis_connection
async def get_keys(request, redis):
    keys = []
    futures = []
    pipeline = redis.pipeline()
    async for key in redis.iscan():
        keys.append(key)
        futures.append(pipeline.type(key))

    types = await pipeline.execute()
    return response.json({'name': key, 'type': key_type.upper()} for key, key_type in zip(keys, types))


@blueprint.route('/connections/<connection_label>/keys', frozenset({'POST'}))
@with_redis_connection
async def create_key(request, redis):
    try:
        key = request.json['key']
        key_type = request.json['type']
        value = request.json['value']
    except KeyError as e:
        err = {'error': f'{e.args[0]} is required'}
        return response.json(err, status=HTTPStatus.BAD_REQUEST)

    try:
        await (util.REDIS_SET_COMMANDS[key_type])(redis, key, value)
    except KeyError:
        err = {'error': f'Key type unrecognized: {key_type}'}
        return response.json(err, status=HTTPStatus.BAD_REQUEST)
    except (ValueError, ReplyError) as e:
        err = {'error': str(e)}
        return response.json(err, status=HTTPStatus.BAD_REQUEST)

    return response.text('', status=HTTPStatus.NO_CONTENT)


@blueprint.route('/connections/<connection_label>/keys/<key>', frozenset({'DELETE'}))
@with_redis_connection
async def delete_key(request, redis, key):
    await redis.delete(key)
    return response.text('', status=HTTPStatus.NO_CONTENT)


@blueprint.route('/connections/<connection_label>/keys/<key>/values', frozenset({'GET'}))
@with_redis_connection
async def get_values(request, redis, key):
    try:
        key_type = request.raw_args['type']
    except KeyError:
        key_type = await redis.type(key)

    try:
        value = await (util.get_redis_get_command(redis, key_type))(key)
    except KeyError:
        err = {'error': f'Key type unrecognized: {key_type}'}
        return response.json(err, status=HTTPStatus.BAD_REQUEST)

    return response.json(util.decode(value))


@blueprint.route('/connections/<connection_label>/keys/<key>/values', frozenset({'POST'}))
@with_redis_connection
async def create_value(request, redis, key):
    try:
        value = request.json['value']
    except KeyError as e:
        err = {'error': f'{e.args[0]} is required'}
        return response.json(err, status=HTTPStatus.BAD_REQUEST)

    try:
        key_type = request.raw_args['type']
    except KeyError:
        key_type = await redis.type(key)

    try:
        await (util.REDIS_ADD_COMMANDS[key_type])(redis, key, value)
    except KeyError:
        err = {'error': f'Key type unrecognized: {key_type}'}
        return response.json(err, status=HTTPStatus.BAD_REQUEST)
    except (ValueError, ReplyError) as e:
        err = {'error': str(e)}
        return response.json(err, status=HTTPStatus.BAD_REQUEST)

    return response.text('', status=HTTPStatus.NO_CONTENT)


@blueprint.route('/connections/<connection_label>/keys/<key>/values/<value>', frozenset({'DELETE'}))
@with_redis_connection
async def delete_key(request, redis, key, value):
    try:
        key_type = request.raw_args['type']
    except KeyError:
        key_type = await redis.type(key)

    try:
        await (util.REDIS_DELETE_COMMANDS[key_type])(redis, key, value)
    except KeyError:
        err = {'error': f'Key type unrecognized: {key_type}'}
        return response.json(err, status=HTTPStatus.BAD_REQUEST)
    except (ValueError, ReplyError) as e:
        err = {'error': str(e)}
        return response.json(err, status=HTTPStatus.BAD_REQUEST)

    return response.text('', status=HTTPStatus.NO_CONTENT)
