(function(){
  var SEL='h1,.orn,.sub,form,.micro,.meta,.finding,.browser,.specbody,.lead,.check,.method h2,.stop,.who,.offer h2,.offer p,.price,.faq h2,.q';
  function run(){
    var els=[].slice.call(document.querySelectorAll(SEL));
    els.forEach(function(el){el.setAttribute('data-r','')});
    var io=new IntersectionObserver(function(en){
      en.forEach(function(e){
        if(!e.isIntersecting)return;
        var sibs=[].slice.call(e.target.parentNode.children)
          .filter(function(n){return n.hasAttribute&&n.hasAttribute('data-r')});
        e.target.style.transitionDelay=Math.min(Math.max(0,sibs.indexOf(e.target)),6)*100+'ms';
        e.target.classList.add('in'); io.unobserve(e.target);
      });
    },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
    els.forEach(function(el){io.observe(el)});
    setTimeout(function(){document.querySelectorAll('[data-r]').forEach(function(el){el.classList.add('in')})},1600);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();
})();
(function(){
  function run(){
    var field=document.querySelector("input[name='website']");
    if(!field)return;
    field.addEventListener('change',function(){
      var value=field.value.trim();
      if(!value||/^[a-z][a-z0-9+.-]*:\/\//i.test(value))return;
      if(!/^[\w.-]+\.[a-z]{2,}(?:\/[\w\-./~%!$&'()*+,;=:@?]*)?$/i.test(value))return;
      field.value='https://'+value;
    });
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();
})();
