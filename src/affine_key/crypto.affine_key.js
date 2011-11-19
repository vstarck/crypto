var crypto = {
    alpha: 'abcdefghijklmnopqrstuvwxyz',
    gcd: function (a,b) {
        return b ? crypto.gcd(b,a % b) : Math.abs(a);
    }
};

crypto.AffineKey = function (opts) {
    opts = opts || {};
    this.offset = opts.offset || 0;
    this.originalAlpha = this.alpha = opts.alpha || crypto.alpha;
    this.modifier = opts.modifier || 1;

    if (opts.key) {
        this.setupKey(opts.key);
        this.setupAlpha();
    }

    if (this.offset < 0) {
        this.offset = (this.offset % this.alpha.length) + this.alpha.length;
    } else if (this.offset > this.alpha.length) {
        this.offset = this.offset % this.alpha.length;
    }

    if (crypto.gcd(this.alpha.length,this.modifier) != 1) {
        throw 'Invalid arguments!';
    }
};

crypto.AffineKey.prototype.setupKey = function (key) {
    this.key = key.replace(/\s*/g,'').split('').reduce(function (memo,chr) {
        if (memo.indexOf(chr) != -1 || chr == '') return memo;

        return memo + chr;
    },'');
};

crypto.AffineKey.prototype.setupAlpha = function () {
    var
            key = this.key,
            lastKeyChar = key.charAt(key.length - 1),
            splitPos = this.alpha.indexOf(lastKeyChar) + 1;
    this.alpha = this.alpha.slice(splitPos) + this.alpha.slice(0,splitPos);

    this.alpha = key + this.alpha.replace(/./g,function (chr,index) {
        return key.indexOf(chr) == -1 ? chr : ''
    });
};

crypto.AffineKey.prototype.encrypt = function (str) {
    var
            offset = this.offset,
            modifier = this.modifier,
            from = this.originalAlpha,
            to = this.alpha,
            alphaSize = from.length;

    return str.split('').reduce(function (memo,chr,i) {
        var
                index = from.indexOf(chr.toLowerCase()),
                up = /[A-Z]/.test(chr);

        if (index != -1) {
            index = (modifier * index + offset) % alphaSize;

            if (index < 0) {
                index += alphaSize;
            }

            chr = to[index];
        }

        return memo + ( up ? chr.toUpperCase() : chr);
    },'');
};

crypto.AffineKey.prototype.decrypt = function (str) {
    var
            offset = -this.offset,
            modifier = 1 / this.modifier,
            from = this.alpha,
            to = this.originalAlpha,
            alphaSize = from.length;

    return str.split('').reduce(function (memo,chr,i) {
        var
                index = from.indexOf(chr.toLowerCase()),
                up = /[A-Z]/.test(chr);

        if (index != -1) {
            index = index + offset;

            while (modifier * index != Math.floor(modifier * index))  {
                index += alphaSize;
            }

            if (index < 0) {
                index += alphaSize;
            }

            chr = to[modifier * index];
        }

        return memo + ( up ? chr.toUpperCase() : chr);
    },'');
};