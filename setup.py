from setuptools import setup, find_packages

setup(
    name='red-velvet',

    version='0.0.0',

    description='Redis Viewer Web UI',

    url='https://github.com/ttpham0111/red-velvet',

    entry_points={
        'console_scripts': [
            'red-velvet = redvelvet.app:start'
        ]
    },

    packages=find_packages(exclude=['test']),
    include_package_data=True,

    install_requires=[
        'sanic',
        'aioredis'
    ]
)
