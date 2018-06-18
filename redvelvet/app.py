from os import path

from aioredis import create_redis_pool
from sanic import Sanic

from redvelvet import api, ws
from redvelvet.config import update_config


here = path.abspath(path.dirname(__file__))


def start():
    app = get_app()

    register_listeners(app)
    register_routes(app)

    app.run(host=app.config.HOST, port=app.config.PORT, workers=app.config.NUM_WORKERS)


def get_app():
    app = Sanic()
    update_config(app)
    return app


def register_listeners(app):
    app.listeners['before_server_start'].append(setup_redis_connections)
    app.listeners['after_server_stop'].append(close_redis_connections)


def register_routes(app):
    static_dir = path.join(here, 'web')
    app.static('/', path.join(static_dir, 'index.html'))
    app.static('/public/', static_dir)

    app.blueprint(api.blueprint, url_prefix='/api')
    app.blueprint(ws.blueprint, url_prefix='/ws')


async def setup_redis_connections(app, loop):
    app.redis_connections = {redis_uri.label: await create_redis_pool(redis_uri.uri)
                             for redis_uri in app.config.REDIS_URIS}


async def close_redis_connections(app, loop):
    for redis in app.redis_connections.values():
        redis.close()
        await redis.wait_closed()


if __name__ == '__main__':
    start()
