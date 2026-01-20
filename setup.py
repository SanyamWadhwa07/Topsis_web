from setuptools import setup, find_packages

setup(
    name="topsis-Sanyam-102303059",
    version="0.1.0",
    description="A Python library for TOPSIS multi-criteria decision analysis (by Sanyam, 102303059)",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="Sanyam Wadhwa",
    author_email="your.email@example.com",
    url="https://github.com/SanyamWadhwa07/Topsis",
    packages=find_packages(),
    install_requires=[
        "numpy",
        "pandas"
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
