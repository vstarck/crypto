var crypto = {
	alpha: 'abcdefghijklmnopqrstuvwxyz'
};

crypto.CaesarCypher = function(opts) {
	opts = opts || {}; 
	this.offset = opts.offset || 0;
	this.alpha = opts.alpha || crypto.alpha;
};

crypto.CaesarCypher.prototype.translate = function(str, offset) {
    var 
		alpha = this.alpha,
		alphaSize = alpha.length;

    return str.split('').reduce(function(memo, chr, i) {
        var
                index = alpha.indexOf(chr.toLowerCase()),
				// es mayusculas?
                up = /[A-Z]/.test(chr);
				
		// si existe en el alfabeto
        if (index != -1) {
			// lo traducimos
            chr = alpha[(index + offset) % alphaSize ];
        }

        return memo + ( up ? chr.toUpperCase() : chr);
    }, '');
};

crypto.CaesarCypher.prototype.encrypt = function(str) {
    return this.translate(str, this.offset, this.modifier, this.alpha, this.originalAlpha);
};

crypto.CaesarCypher.prototype.decrypt = function(str) {
    return this.translate(str, -this.offset, 1/this.modifier, this.originalAlpha, this.alpha);
};