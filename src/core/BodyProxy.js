/**
 * Treba biti neka shema da je to doc fragment i da se onda clonaju u svoj parent doc frag i na kraju oni koji nemaju parent se puknu u body
 * ili da $el postane docfragment
 */
Fly.def('Fly.BodyProxy', {
    singleton : true,

    proxy : document.createDocumentFragment(),

    append : function (el) {
        var proxy = this.proxy;

        proxy.
    }
});