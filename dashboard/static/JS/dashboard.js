// DOMContentLoaded=>jan html ka complite page load ho jay tab js ka code run kare
document.addEventListener('DOMContentLoaded', function() {
  // Animate stat numbers
  document.querySelectorAll('.stat-info h3').forEach(el => {
    const target = parseInt(el.textContent) || 0;
    //  parseInt(el.textContent) value valid nahi mila to ushe zero kar dega 
    if (target === 0) return;

    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));

    // setInterval()=> isaka kam isake ander diye code ek ek fix time bar bar run karana hai
    const interval = setInterval(() => {
      current += step;
      //clearInterval(interval);=> contition ko true bad ye code run karta hai like target mil jane par code ko stop kar deta hai
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current;
    }, 30);
  });
});


















// ======================COPY CODE==================================

// DOMContentLoaded=>jan html ka complite page load ho jay tab js ka code run kare


/*
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.stat-info h3').forEach(cl=>{
    const target=parseInt(el.textContent) || 0;

    if(target==0) return;

    let current=0;
    const step=Math.max(1,Math.floor(target/30));
    const interval=setInterval(()=>{
      current+=step;
      if(current>=target){
 current=target;
 clearInterval(interval);
      }
      el.textContent=current;
    },30);
  })
})
  */