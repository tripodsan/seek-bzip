# seek-bzip

`seek-bzip` is a pure-javascript Node.JS module adapted from 'node-bzip' and before that antimatter15's pure-javascript implementation for decoding bzip2 data.  `seek-bzip` currently only decodes buffers into other buffers, synchronously.  Unlike `node-bzip`, `seek-bzip` can seek to and decode single blocks from the bzip2 file.

## How to Install

```
npm install seek-bzip
```

## Usage

After compressing some example data into `example.bz2`, the following with recreate that original data and save it to `example`.

```
var Bunzip = require('seek-bzip');
var fs = require('fs');

var compressedData = fs.readFileSync('example.bz2');
var data = Bunzip.decode(compressedData);

fs.writeFileSync('example', data);
```

See the tests in the `tests/` directory for further usage examples.

For uncompressing single blocks of bzip2-compressed data, you will need
an out-of-band index listing the start of each bzip2 block.  (Presumably
you generate this at the same time as you index the start of the information
you wish to seek to inside the compressed file.)  The `seek-bzip` module
has been designed to be compatible with the C implementation `seek-bzip2`
available from https://bitbucket.org/james_taylor/seek-bzip2.  That codebase
contains a `bzip-table` tool which will generate bzip2 block start indices.

## Documentation

`require('seek-bzip')` returns a `Bunzip` object.  It contains three static
methods.  The first is a function accepting one or two parameters:

`Bunzip.decode = function(input, [Number expectedSize] or [output], [boolean multistream])`

The `input` argument can be a "stream" object (which must implement the
`readByte` method), or a `Buffer`.

If `expectedSize` is not present, `decodeBzip` simply decodes `input` and
returns the resulting `Buffer`.

If `expectedSize` is present (and numeric), `decodeBzip` will store
the results in a `Buffer` of length `expectedSize`, and throw an error
in the case that the size of the decoded data does not match
`expectedSize`.

If you pass a non-numeric second parameter, it can either be a `Buffer`
object (which must be of the correct length; an error will be thrown if
the size of the decoded data does not match the buffer length) or
a "stream" object (which must implement a `writeByte` method).

The optional third `multistream` parameter, if true, attempts to continue
reading past the end of the bzip2 file.  This supports "multistream"
bzip2 files, which are simply multiple bzip2 files concatenated together.
If this argument is true, the input stream must have an `eof` method
which returns true when the end of the input has been reached.

The second exported method is a function accepting two or three parameters:

`Bunzip.decodeBlock = function(input, Number blockStartBits, [Number expectedSize] or [output])`

The `input` and `expectedSize`/`output` parameters are as above.
The `blockStartBits` parameter gives the start of the desired block, in bits.

If passing a stream as the `input` parameter, it must implement the
`seek` method.

The final exported method is a function accepting two or three parameters:

`Bunzip.table = function(input, Function callback, [boolean multistream])`

The `input` and `multistream` parameters are identical to those for the
`decode` method.

This function will invoke `callback(position, size)` once per bzip2 block,
where `position` gives the starting position of the block (in *bits*), and
`size` gives the uncompressed size of the block (in bytes).

This can be used to construct an index allowing direct access to a particular
block inside a bzip2 file, using the `decodeBlock` method.

## Help wanted

The following improvements to this module would be generally useful.
Feel free to fork on github and submit pull requests!

* Add compression along with decompression.  See `micro-bzip` at
http://www.landley.net/code/

## License

#### LGPL 2.1 License

> Copyright &copy; 2013 C. Scott Ananian
>
> Copyright &copy; 2012 Eli Skeggs
>
> Copyright &copy; 2011 Kevin Kwok
>
> This library is free software; you can redistribute it and/or
> modify it under the terms of the GNU Lesser General Public
> License as published by the Free Software Foundation; either
> version 2.1 of the License, or (at your option) any later version.
>
> This library is distributed in the hope that it will be useful,
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
> Lesser General Public License for more details.
>
> You should have received a copy of the GNU Lesser General Public
> License along with this library; if not, see
> http://www.gnu.org/licenses/lgpl-2.1.html
