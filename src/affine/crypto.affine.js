var crypto = {
	alpha: 'abcdefghijklmnopqrstuvwxyz'
};

crypto.Affine = function(opts) {
	opts = opts || {}; 
	this.offset = opts.offset || 0;
	this.alpha = opts.alpha || crypto.alpha;
	this.modifier = opts.modifier || 1;
	
	if(this.offset < 0) {
		this.offset = (this.offset % this.alpha.length) + this.alpha.length;
	}
};

crypto.Affine.prototype.translate = function(str, offset, modifier) {
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
			var newIndex = (modifier * (index + offset)) % alphaSize;
			// lo traducimos
			console.log(chr, ' -> ', index, newIndex);
            chr = alpha[newIndex ];
        }

        return memo + ( up ? chr.toUpperCase() : chr);
    }, '');
};

crypto.Affine.prototype.encrypt = function(str) {
    return this.translate(str, this.offset, this.modifier);
};

crypto.Affine.prototype.decrypt = function(str) {
    return this.translate(str, -this.offset, 1/this.modifier);
};