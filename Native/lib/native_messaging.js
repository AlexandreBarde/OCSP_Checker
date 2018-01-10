'use strict'

const stream = require('stream')
const util = require('util')

function Input() {
    stream.Transform.call(this);

    this._writableState.objectMode = false;
    this._readableState.objectMode = true;
    this.buf = new Buffer(0);
    this.len = null;
}

util.inherits(Input, stream.Transform);

Input.prototype._transform = function (chunk, encoding, done) {
    this.buf = Buffer.concat([this.buf, chunk]);

    var self = this;

    function parseBuf() {
        if (typeof self.len !== 'number') {
            if (self.buf.length >= 4) {
                self.len = self.buf.readUInt32LE(0);
                self.buf = self.buf.slice(4);
            }
        }

        if (typeof self.len === 'number') {
            if (self.buf.length >= self.len) {
                var message = self.buf.slice(0, self.len);
                self.buf = self.buf.slice(self.len);
                self.len = null;
                var obj = JSON.parse(message.toString());
                self.push(obj);
                parseBuf();
            }
        }
    }
    parseBuf();
    done();
};

function Output() {
    stream.Transform.call(this);

    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
}

util.inherits(Output, stream.Transform);

Output.prototype._transform = function (chunk, encoding, done) {
    var len = new Buffer(4);
    var buf = new Buffer(JSON.stringify(chunk));

    len.writeUInt32LE(buf.length, 0);

    this.push(len);
    this.push(buf);

    done();
};

function Transform(handler) {
    stream.Transform.call(this);

    this._writableState.objectMode = true;
    this._readableState.objectMode = true;

    this.handler = handler;
}

util.inherits(Transform, stream.Transform);

Transform.prototype._transform = function (msg, encoding, done) {
    this.handler(msg, this.push.bind(this), done);
};

exports.Input = Input
exports.Output = Output
exports.Transform = Transform
