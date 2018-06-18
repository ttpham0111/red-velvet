from functools import partial

from aioredis import create_redis_pool


def decode(value, _encoding='utf-8'):
    try:
        if isinstance(value, bytes):
            return value.hex().upper() if _encoding == 'hex' else value.decode(_encoding)
        elif isinstance(value, list):
            return [decode(o, _encoding) for o in value]
        elif isinstance(value, dict):
            return {decode(k, _encoding): decode(v, _encoding) for k, v in value.items()}
    except UnicodeDecodeError:
        return decode(value, _encoding='hex')

    return value


async def reconnect_to_redis(app, connection_label):
    redis = app.redis_connections[connection_label]

    redis.close()
    await redis.wait_closed()

    for redis_uri in app.config.REDIS_URIS:
        if redis_uri.label == connection_label:
            redis = await create_redis_pool(redis_uri.uri)
            app.redis_connections[connection_label] = redis
            break

    return redis


def get_redis_get_command(redis, key_type):
    command = _REDIS_GET_COMMANDS[key_type]
    fn = getattr(redis, command)
    if key_type == 'LIST':
        fn = partial(fn, start=0, stop=-1)
    elif key_type == 'ZSET':
        fn = partial(fn, start=0, stop=-1, withscores=True)
    return fn


async def redis_set(redis, key, value):
    await redis.set(key, value)


async def redis_lpush(redis, key, value):
    await redis.lpush(key, value)


async def redis_sadd(redis, key, value):
    await redis.sadd(key, value)


async def redis_zadd(redis, key, value):
    try:
        score = float(value['score'])
        member = value['value']
    except KeyError as e:
        raise ValueError(f'value.{e.args[0]} is required')
    except (TypeError, ValueError):
        raise ValueError(f'value.score should be a number')

    await redis.zadd(key, score, member)


async def redis_hset(redis, key, value):
    try:
        field = value['field']
        value = value['value']
    except KeyError as e:
        raise ValueError(f'value.{e.args[0]} is required')

    await redis.hset(key, field, value)


async def redis_lrem(redis, key, value):
    await redis.lrem(key, 1, value)


async def redis_srem(redis, key, member):
    await redis.srem(key, member)


async def redis_zrem(redis, key, member):
    await redis.zrem(key, member)


async def redis_hdel(redis, key, field):
    await redis.hdel(key, field)


_REDIS_GET_COMMANDS = {
    'STRING': 'get',
    'LIST': 'lrange',
    'SET': 'smembers',
    'ZSET': 'zrange',
    'HASH': 'hgetall'
}

REDIS_SET_COMMANDS = {
    'STRING': redis_set,
    'LIST': redis_lpush,
    'SET': redis_sadd,
    'ZSET': redis_zadd,
    'HASH': redis_hset
}

REDIS_ADD_COMMANDS = {
    'STRING': redis_set,
    'LIST': redis_lpush,
    'SET': redis_sadd,
    'ZSET': redis_zadd,
    'HASH': redis_hset
}

REDIS_DELETE_COMMANDS = {
    'LIST': redis_lrem,
    'SET': redis_srem,
    'ZSET': redis_zrem,
    'HASH': redis_hdel
}
