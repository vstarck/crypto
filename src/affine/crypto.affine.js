var crypto = {
    alpha: 'abcdefghijklmnopqrstuvwxyz'
};

crypto.Affine = function (opts) {
    opts = opts || {};
    this.offset = opts.offset || 0;
    this.alpha = opts.alpha || crypto.alpha;
    this.modifier = opts.modifier || 1;

    if (this.offset < 0) {
        this.offset = (this.offset % this.alpha.length) + this.alpha.length;
    } else {
        this.offset = this.offset % this.alpha.length;
    }
};

crypto.Affine.prototype.encrypt = function (str) {
    var
            offset = this.offset,
            modifier = this.modifier,
            alpha = this.alpha,
            alphaSize = alpha.length;

    return str.split('').reduce(function (memo,chr,i) {
        var
                index = alpha.indexOf(chr.toLowerCase()),
                up = /[A-Z]/.test(chr),
                newIndex;

        if (index != -1) {
            newIndex = (modifier * index + offset) % alphaSize;
            chr = alpha[newIndex];
        }

        return memo + ( up ? chr.toUpperCase() : chr);
    },'');
};

crypto.Affine.prototype.decrypt = function (str) {
    var
            offset = -this.offset,
            modifier = 1 / this.modifier,
            alpha = this.alpha,
            alphaSize = alpha.length;

    return str.split('').reduce(function (memo,chr,i) {
        var
                index = alpha.indexOf(chr.toLowerCase()),
                up = /[A-Z]/.test(chr),
                newIndex;

        if (index != -1) {
            index = +offset;

            while (modifier * index != Math.floor(modifier * index)) {
                index += alphaSize;
            }

            newIndex = (modifier * index) % alphaSize;

            chr = alpha[newIndex];
        }

        return memo + ( up ? chr.toUpperCase() : chr);
    },'');
};