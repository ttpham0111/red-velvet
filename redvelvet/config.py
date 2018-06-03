from collections import namedtuple
from os import environ


RedisURI = namedtuple('RedisURI', ['label', 'uri'])


def update_config(app):
    app.config.HOST = environ.get('HOST', '0.0.0.0')
    app.config.PORT = int(environ.get('PORT', 8000))
    app.config.NUM_WORKERS = int(environ.get('NUM_WORKERS', 1))

    redis_uris_string = environ.get('REDIS_URIS', 'local::redis://localhost')
    app.config.REDIS_URIS = [_parse_redis_uri(redis_uri_string, default_label=str(i))
                             for i, redis_uri_string in enumerate(redis_uris_string.split(','))]


def _parse_redis_uri(string, default_label=''):
    label, uri = default_label, string
    if '::' in string:
        label, uri = string.split('::', 1)

    return RedisURI(label=label, uri=uri)
