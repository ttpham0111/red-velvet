from setuptools import setup, find_packages

setup(
    name='red-velvet',
    version='0.0.4',
    description='Redis Viewer Web UI',
    url='https://github.com/ttpham0111/red-velvet',

    classifiers=(
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3',
        'Topic :: Software Development :: User Interfaces',
        'Topic :: Utilities'
    ),

    entry_points={
        'console_scripts': (
            'red-velvet = redvelvet.app:start',
        )
    },

    packages=find_packages(exclude=['test']),
    include_package_data=True,

    install_requires=(
        'sanic',
        'aioredis',
    )
)
