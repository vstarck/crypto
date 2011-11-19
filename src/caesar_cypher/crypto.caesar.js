var crypto = {
    alpha: 'abcdefghijklmnopqrstuvwxyz'
};

crypto.CaesarCypher = function (opts) {
    opts = opts || {};
    this.offset = opts.offset || 0;
    this.alpha = opts.alpha || crypto.alpha;

    if (this.offset < 0) {
        this.offset = (this.offset % this.alpha.length) + this.alpha.length;
    } else if (this.offset > this.alpha.length) {
        this.offset = this.offset % this.alpha.length;
    }
};

crypto.CaesarCypher.prototype.translate = function (str,offset) {
    var
            alpha = this.alpha,
            alphaSize = alpha.length;

    return str.split('').reduce(function (memo,chr,i) {
        var
                index = alpha.indexOf(chr.toLowerCase()),
                isUppercase = /[A-Z]/.test(chr);

        if (index != -1) {
            index = (index + offset) % alphaSize;

            if (index < 0) {
                index += alphaSize;
            }
            chr = alpha[index];
        }

        return memo + ( isUppercase ? chr.toUpperCase() : chr);
    },'');
};

crypto.CaesarCypher.prototype.encrypt = function (str) {
    return this.translate(str,this.offset);
};

crypto.CaesarCypher.prototype.decrypt = function (str) {
    return this.translate(str,-this.offset);
};