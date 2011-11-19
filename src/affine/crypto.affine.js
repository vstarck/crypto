var crypto = {
    alpha: 'abcdefghijklmnopqrstuvwxyz',
    gcd: function (a,b) {
        return b ? crypto.gcd(b,a % b) : Math.abs(a);
    }
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

    if (crypto.gcd(this.alpha.length,this.modifier) != 1) {
        throw 'Invalid arguments!';
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
                up = /[A-Z]/.test(chr);

        if (index != -1) {
            index = (modifier * index + offset) % alphaSize;

            if (index < 0) {
                index += alphaSize;
            }

            chr = alpha[index];
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
                up = /[A-Z]/.test(chr);

        if (index != -1) {
            index = index + offset;

            while (modifier * index != Math.floor(modifier * index))  {
                index += alphaSize;
            }

            if (index < 0) {
                index += alphaSize;
            }

            chr = alpha[modifier * index];
        }

        return memo + ( up ? chr.toUpperCase() : chr);
    },'');
};