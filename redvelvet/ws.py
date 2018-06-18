from functools import wraps
import json

from sanic import Blueprint

from redvelvet import util


blueprint = Blueprint('WS')


def with_redis_connection(fn):
    @wraps(fn)
    async def wrapper(request, ws, connection_label, *args, **kwargs):
        try:
            redis = request.app.redis_connections[connection_label]
        except KeyError:
            return await ws.send(f'(error) ERR Redis connection label unrecognized: {connection_label}')

        try:
            return await fn(request, ws, redis, *args, **kwargs)
        except TimeoutError:
            redis = await util.reconnect_to_redis(request.app, connection_label)
            return await fn(request, ws, redis, *args, **kwargs)
    return wrapper


@blueprint.websocket('/<connection_label>/execute')
@with_redis_connection
async def get_keys(request, ws, redis):
    async for message in ws:
        data = {'command': message, 'result': '', 'encoding': ''}

        command, *args = message.split()
        command = command.upper()

        try:
            # TODO: Blacklist commands
            result = await (getattr(redis, command.lower()))(*args)
        except AttributeError:
            data['result'] = f"(error) ERR unknown command '{command}'"
        except TypeError:
            data['result'] = f"(error) ERR wrong number of arguments for '{command}' command"
        else:
            data['result'] = util.decode(result)

        await ws.send(json.dumps(data))
