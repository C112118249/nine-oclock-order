'use strict';
// 玖點茶飲期中作品：本機前端模擬，不連接店家系統。
// 品名及價格參照使用者提供菜單照片，少數「紅/綠/青」沿用菜單合併寫法。
const rawDrinks = [
 ['玖點紅茶','好茶',25,30],['茉香綠茶','好茶',25,30],['特選青茶','好茶',25,30],['焙香烏龍茶','好茶',25,30],['玖點冬瓜茶','好茶',25,30],['冬瓜紅/綠/青','好茶',30,35],
 ['玖點奶茶','奶茶',35,45],['椰果奶茶','奶茶',45,55],['珍珠奶茶','奶茶',45,55],['布丁奶茶','奶茶',45,55],['雙Q奶茶','奶茶',45,55],['咖啡凍奶茶','奶茶',45,55],['蜂蜜奶茶','奶茶',45,55],
 ['玖點拿鐵','鮮奶',40,50],['綠茶拿鐵','鮮奶',40,50],['烏龍拿鐵','鮮奶',40,50],['冬瓜鮮奶','鮮奶',40,50],['黑糖鮮奶','鮮奶',45,null],['黑糖珍珠鮮奶','鮮奶',55,null],['金蘋果鮮奶','鮮奶',50,60],
 ['蜜茶','特調',30,35],['梅子綠茶','特調',35,45],['多多綠/紅/青','特調',45,50],['金蘋果紅/綠/青','特調',45,50],['可爾必思','特調',30,40],['芒果冰茶','特調',45,55],['冰淇淋紅茶','特調',40,50],['阿華田','特調',50,60],['可可','特調',50,60],['咖啡牛奶','特調',40,50],
 ['可樂/雪碧','氣泡',30,35],['梅子可樂','氣泡',30,35],['檸檬雪碧','氣泡',35,45],['芒果/草莓氣泡飲','氣泡',40,null],['芒果啵啵','氣泡',50,null],
 ['蜂蜜檸檬','新鮮',35,45],['檸檬紅/綠/青','新鮮',35,45],['冬瓜檸檬','新鮮',35,45],['檸檬多多','新鮮',45,55],['檸檬綠茶','新鮮',35,45],['百香多多','新鮮',45,55],['百香綠茶','新鮮',35,45],['百香雙Q','新鮮',45,55],
 ['奶蓋紅茶','奶蓋',50,null],['奶蓋綠茶','奶蓋',50,null],['奶蓋青茶','奶蓋',50,null],['奶蓋烏龍茶','奶蓋',50,null],
 ['豆漿','豆漿',30,40],['豆漿紅茶','豆漿',30,40],['豆漿冬瓜','豆漿',30,40]
];
const drinks = rawDrinks.map(([name,category,L,XL],index)=>({id:index+1,name,category,prices:{...(L!==null?{L}:{}),...(XL!==null?{XL}:{})}}));
const categories = ['全部','好茶','奶茶','鮮奶','特調','氣泡','新鮮','奶蓋','豆漿'];
const sugars = ['全糖','少糖','半糖','微糖','1分','無糖'];
const ices = ['正常','少冰','微冰','去冰'];
const toppings = [{name:'珍珠',price:10},{name:'椰果',price:10},{name:'布丁',price:10},{name:'寒天',price:10},{name:'咖啡凍',price:10},{name:'冰淇淋',price:15}];
let category='全部', keyword='', selectedDrink=null, selectedQty=1, cart=[];
const $ = id=>document.getElementById(id);
const escapeHTML = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dollar = n=>`NT$ ${n}`;
let toastTimer;
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),1700)}
function selectedRadio(name){return document.querySelector(`input[name="${name}"]:checked`)?.value ?? ''}
function selectedToppings(){return [...document.querySelectorAll('input[name="topping"]:checked')].map(input=>input.value).sort()}
function choiceHtml(name,label,value,checked=false,extra=''){
 const key=`${name}-${value}`;
 return `<label class="choice" for="${escapeHTML(key)}"><input type="${name==='topping'?'checkbox':'radio'}" id="${escapeHTML(key)}" name="${name}" value="${escapeHTML(value)}" ${checked?'checked':''}><span>${escapeHTML(label)}${extra}</span></label>`;
}
function renderCategories(){ $('categories').innerHTML=categories.map(c=>`<button type="button" class="category-btn ${c===category?'active':''}" data-category="${escapeHTML(c)}" aria-pressed="${c===category}">${escapeHTML(c)}</button>`).join('') }
function renderDrinks(){
 const matched=drinks.filter(d=>(category==='全部'||d.category===category)&&d.name.includes(keyword));
 $('menuCount').textContent=`${matched.length} 款飲品`;
 $('drinkList').innerHTML=matched.length ? matched.map(d=>{
  const priceList=Object.entries(d.prices).map(([s,p])=>`${s} $${p}`).join(' / ');
  const artClass=d.category==='鮮奶'||d.category==='奶茶'||d.category==='奶蓋'||d.category==='豆漿'?'milk':d.category==='新鮮'?'fresh':d.category==='氣泡'?'soda':d.category==='特調'?'special':'';
  return `<article class="drink-card"><div class="drink-art ${artClass}" aria-hidden="true"><span class="art-star">✧</span></div><div class="drink-info"><h3>${escapeHTML(d.name)}</h3><p>${escapeHTML(d.category)} · ${escapeHTML(priceList)}</p><div class="drink-price">${dollar(Math.min(...Object.values(d.prices)))} <small>起</small></div></div><button type="button" class="add-button" data-drink="${d.id}" aria-label="客製化${escapeHTML(d.name)}">＋</button></article>`
 }).join(''):'<div class="empty-results">沒有找到符合的飲料，試試其他關鍵字吧。</div>';
}
function showModal(which){ $('modalBackdrop').hidden=false;[ 'customModal','cartModal','doneModal'].forEach(id=>$(id).hidden=id!==which);document.body.style.overflow='hidden';setTimeout(()=>$(which).querySelector('button')?.focus(),0)}
function hideModal(){ $('modalBackdrop').hidden=true;['customModal','cartModal','doneModal'].forEach(id=>$(id).hidden=true);document.body.style.overflow='' }
function openCustomize(id){
 selectedDrink=drinks.find(d=>d.id===id); if(!selectedDrink)return;
 selectedQty=1;$('customQty').textContent='1';$('customTitle').textContent=selectedDrink.name;$('customCategory').textContent=`${selectedDrink.category} · 請選擇飲料規格`;
 $('sizeOptions').innerHTML=Object.entries(selectedDrink.prices).map(([s,p],i)=>choiceHtml('size',`${s} · $${p}`,s,i===0)).join('');
 $('sugarOptions').innerHTML=sugars.map((s,i)=>choiceHtml('sugar',s,s,i===2)).join('');
 $('iceOptions').innerHTML=ices.map((s,i)=>choiceHtml('ice',s,s,i===0)).join('');
 $('toppingOptions').innerHTML=toppings.map(t=>choiceHtml('topping',t.name,t.name,false,`<b>+$${t.price}</b>`)).join('');
 updateCustomPrice();showModal('customModal');
}
function currentUnitPrice(){const size=selectedRadio('size'); const base=selectedDrink?.prices[size]??0;return base+selectedToppings().reduce((sum,name)=>sum+(toppings.find(t=>t.name===name)?.price??0),0)}
function updateCustomPrice(){$('customPrice').textContent=`$${currentUnitPrice()*selectedQty}`}
function addToCart(){if(!selectedDrink)return;
 const size=selectedRadio('size'),sugar=selectedRadio('sugar'),ice=selectedRadio('ice'),extras=selectedToppings();
 const unitPrice=currentUnitPrice(), key=JSON.stringify([selectedDrink.id,size,sugar,ice,extras]);
 const existing=cart.find(item=>item.key===key);
 if(existing)existing.qty+=selectedQty;else cart.push({key,id:selectedDrink.id,name:selectedDrink.name,size,sugar,ice,extras,unitPrice,qty:selectedQty});
 renderCart();hideModal();toast(`已加入 ${selectedDrink.name} × ${selectedQty}`);
}
function summary(){return cart.reduce((a,item)=>({qty:a.qty+item.qty,total:a.total+item.qty*item.unitPrice}),{qty:0,total:0})}
function renderCart(){
 const {qty,total}=summary();$('cartBadge').textContent=qty;$('bottomCount').textContent=qty?`購物車 · ${qty} 杯`:'尚未選擇飲料';$('bottomTotal').textContent=`$${total}`;$('cartQty').textContent=`${qty} 杯`;$('cartTotal').textContent=dollar(total);
 $('cartItems').innerHTML=cart.length ? cart.map((item,index)=>`<div class="cart-row"><div class="cart-row-main"><strong>${escapeHTML(item.name)} · ${escapeHTML(item.size)}</strong><strong class="amount">${dollar(item.qty*item.unitPrice)}</strong></div><div class="cart-row-desc">${escapeHTML(item.sugar)}・${escapeHTML(item.ice)}${item.extras.length?'・加料：'+escapeHTML(item.extras.join('、')):''}<br>單價 ${dollar(item.unitPrice)}</div><div class="cart-row-actions"><div class="mini-qty"><button type="button" data-index="${index}" data-change="-1" aria-label="減少${escapeHTML(item.name)}數量">−</button><span>${item.qty}</span><button type="button" data-index="${index}" data-change="1" aria-label="增加${escapeHTML(item.name)}數量">＋</button></div><button type="button" class="delete-btn" data-remove="${index}">刪除</button></div></div>`).join(''):'<div class="cart-empty"><span>♡</span>還沒有飲料，去選一杯吧！</div>';
 $('placeOrder').disabled=cart.length===0;$('placeOrder').style.opacity=cart.length?1:.5;
}
function submitOrder(){if(!cart.length){toast('請先選擇飲料');return}
 const {qty,total}=summary();
 $('orderSummary').innerHTML=cart.map(item=>`<div class="receipt-row"><span>${escapeHTML(item.name)} (${escapeHTML(item.size)}) × ${item.qty}<br><small>${escapeHTML(item.sugar)}／${escapeHTML(item.ice)}${item.extras.length?'／'+escapeHTML(item.extras.join('、')):''}</small></span><strong>$${item.unitPrice*item.qty}</strong></div>`).join('')+`<div class="receipt-row receipt-total"><span>總計 ${qty} 杯</span><strong>${dollar(total)}</strong></div>`;
 cart=[];renderCart();showModal('doneModal');
}
// 事件代理：動態生成的飲料卡片與購物車按鈕都可以使用同一個監聽器。
$('categories').addEventListener('click',event=>{const btn=event.target.closest('[data-category]');if(!btn)return;category=btn.dataset.category;renderCategories();renderDrinks()});
$('searchInput').addEventListener('input',event=>{keyword=event.target.value.trim();renderDrinks()});
$('drinkList').addEventListener('click',event=>{const btn=event.target.closest('[data-drink]');if(btn)openCustomize(Number(btn.dataset.drink))});
$('customModal').addEventListener('change',updateCustomPrice);
$('customMinus').addEventListener('click',()=>{selectedQty=Math.max(1,selectedQty-1);$('customQty').textContent=selectedQty;updateCustomPrice()});
$('customPlus').addEventListener('click',()=>{selectedQty=Math.min(99,selectedQty+1);$('customQty').textContent=selectedQty;updateCustomPrice()});
$('addCartBtn').addEventListener('click',addToCart);
$('cartItems').addEventListener('click',event=>{
 const changed=event.target.closest('[data-change]');const remove=event.target.closest('[data-remove]');
 if(changed){const index=Number(changed.dataset.index);if(!cart[index])return;cart[index].qty+=Number(changed.dataset.change);if(cart[index].qty<=0)cart.splice(index,1);renderCart()}
 if(remove){cart.splice(Number(remove.dataset.remove),1);renderCart()}
});
$('openCartBtn').addEventListener('click',()=>showModal('cartModal'));
$('bottomCheckout').addEventListener('click',()=>showModal('cartModal'));
$('closeCustom').addEventListener('click',hideModal);
$('closeCart').addEventListener('click',hideModal);
$('continueShopping').addEventListener('click',hideModal);
$('placeOrder').addEventListener('click',submitOrder);
$('doneClose').addEventListener('click',hideModal);
$('modalBackdrop').addEventListener('click',hideModal);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('modalBackdrop').hidden)hideModal()});
renderCategories();renderDrinks();renderCart();
