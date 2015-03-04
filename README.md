##Installation
If you want to run these scripts locally on your machine, be sure you have the following requirements installed.

###Requirements

- [Git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
- [Node](http://nodejs.org/download/)


Clone musixmatch-scripts from the command line:

``` sh
$ git clone https://github.com/uf0/musixmatch-scripts.git
```

browse to musixmatch-scripts root folder:

``` sh
$ cd musixmatch-scripts
```

install node dependencies:

``` sh
$ npm install
```

edit configuration file

```sh
$ cp config.sample.js config.js
```

open ```config.js``` file and add you API key

add data folder

``` sh
$ mkdir data
```

add words file

``` sh
$ touch data/words.json
```

open ```words.json``` file insert the words to search for as an array

```
[
  'rappresaglia',
  'bella ciao',
  'libertà strada per strada'
]
```

run the script

``` sh
$ node index.js
```
