const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const themeMap = {
  orange: { bg: '#ff633f', text: '#17263c', pop: '#ffcf56', light: '#fff9ed' },
  blue: { bg: '#2354d8', text: '#f7f2e8', pop: '#c8ff5c', light: '#ffffff' },
  forest: { bg: '#134e43', text: '#f4eddf', pop: '#f0a96d', light: '#ffffff' },
  mono: { bg: '#161616', text: '#f4f4f0', pop: '#ff5a36', light: '#ffffff' }
};

const toneWords = {
  friendly: ['쉽게 시작해요', '이것만 기억하세요', '오늘부터 하나씩'],
  professional: ['핵심을 짚어보겠습니다', '데이터가 말하는 핵심', '실행 전략을 정리했습니다'],
  bold: ['지금 바꾸세요', '결과는 습관이 만듭니다', '딱 이것만 하세요'],
  warm: ['당신의 속도면 충분해요', '작은 변화가 쌓입니다', '오늘의 나를 응원하며']
};

let slides = [];
let current = 0;
let zoom = 82;
let originalSlide = null;
let ratioKey = 'portrait';
let brandName = '김영숙부동산';
let brandPhone = '010-2167-2400';
const ratios = { portrait: { width: 1080, height: 1350, label: '1080 × 1350' }, square: { width: 1080, height: 1080, label: '1080 × 1080' } };

function cleanTopic(topic) { return topic.trim().replace(/[.!?]$/,'') || '나만의 새로운 이야기'; }
function shortTopic(topic) { return topic.length > 18 ? topic.slice(0, 18) + '…' : topic; }

function buildSlides(topic, audience, tone, count) {
  const t = cleanTopic(topic);
  const focus = t.replace(/(을|를|이|가|은|는|에|의) /g, ' ');
  const words = toneWords[tone];
  const library = [
    { kicker: '한눈에 보는 가이드', title: t, body: `${audience}를 위해 꼭 필요한 내용만 쉽고 선명하게 정리했어요.`, layout: 'cover' },
    { kicker: '왜 지금 중요할까요?', title: `작은 관심이\n큰 차이를 만듭니다`, body: `${focus}은 거창한 결심보다 작은 이해에서 시작됩니다.`, layout: 'quote' },
    { kicker: 'POINT 01', title: `먼저, 기준을\n하나 정하세요`, body: `내 상황과 목표에 맞는 기준이 있어야 흔들리지 않고 이어갈 수 있어요.`, layout: 'center' },
    { kicker: 'POINT 02', title: `작게 시작하고\n자주 반복하세요`, body: `완벽한 한 번보다 부담 없는 반복이 더 오래가는 변화를 만듭니다.`, layout: 'cover' },
    { kicker: 'POINT 03', title: `기록하면\n성장이 보입니다`, body: `매일의 작은 변화와 느낌을 남겨 나만의 패턴을 발견해 보세요.`, layout: 'center' },
    { kicker: '잠깐, 체크!', title: `이런 실수는\n피해 주세요`, body: `남과 비교하기, 처음부터 무리하기, 결과를 너무 빨리 기대하기.`, layout: 'quote' },
    { kicker: words[0], title: `오늘 단 하나만\n실천해 보세요`, body: `${focus}을 위한 가장 쉬운 행동 하나를 정하고 바로 시작해 보세요.`, layout: 'cover' },
    { kicker: 'SAVE & SHARE', title: `필요할 때 다시\n꺼내 보세요`, body: `저장해 두고 하나씩 실천하면 어느새 달라진 나를 만나게 될 거예요.`, layout: 'center' },
    { kicker: words[1], title: `꾸준함을 만드는\n나만의 장치`, body: `시간과 장소를 정하고 작은 보상을 더하면 실천이 훨씬 쉬워집니다.`, layout: 'cover' },
    { kicker: words[2], title: `변화의 시작은\n바로 오늘`, body: `${audience}의 더 나은 내일을 위한 첫걸음, 지금 함께 시작해요.`, layout: 'quote' }
  ];
  const selected = count <= 7 ? [...library.slice(0, count - 1), library[7]] : library.slice(0, count);
  return selected.map((s, i) => ({ ...s, id: Date.now() + i, theme: i % 4 === 1 ? 'blue' : i % 4 === 4 ? 'forest' : 'orange', category: i === 0 ? 'SMART CONTENT' : i === selected.length - 1 ? 'KEEP & SHARE' : `STORY ${String(i).padStart(2,'0')}` }));
}

function render() {
  if (!slides.length) return;
  const s = slides[current];
  const card = $('#instaCard');
  card.className = `insta-card theme-${s.theme} layout-${s.layout}`;
  $('.card-category').textContent = s.category;
  $('.card-number').textContent = `${String(current + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  $('.card-kicker').textContent = s.kicker;
  const titleParts = s.title.split('\n');
  $('.card-title').innerHTML = titleParts.map((x,i) => i === titleParts.length - 1 && titleParts.length > 1 ? `<em>${escapeHtml(x)}</em>` : escapeHtml(x)).join('<br>');
  $('.card-body').textContent = s.body;
  $('#cardBrand').textContent = [brandName.trim(), brandPhone.trim()].filter(Boolean).join(' · ') || '@cardmate.studio';
  const dimensions = ratios[ratioKey];
  $('#cardFrame').style.setProperty('--card-ratio', `${dimensions.width}/${dimensions.height}`);
  $('#sizePill').textContent = dimensions.label;
  $('#kickerEdit').value = s.kicker;
  $('#titleEdit').value = s.title.replace(/\n/g,' ');
  $('#bodyEdit').value = s.body;
  $('#currentLabel').textContent = current + 1;
  $('#totalLabel').textContent = slides.length;
  $$('.palette').forEach(b => b.classList.toggle('active', b.dataset.theme === s.theme));
  $$('.layout-choice').forEach(b => b.classList.toggle('active', b.dataset.layout === s.layout));
  $('#moveLeftBtn').disabled = current === 0;
  $('#moveRightBtn').disabled = current === slides.length - 1;
  $('#deleteSlideBtn').disabled = slides.length <= 3;
  renderStrip();
  saveState();
}

function escapeHtml(v){ return v.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function renderStrip() {
  const root = $('#slideStrip');
  root.innerHTML = slides.map((s,i) => {
    const c = themeMap[s.theme];
    return `<button class="slide-thumb ${i===current?'active':''}" data-index="${i}" aria-label="${i+1}번 카드"><span class="thumb-inner" style="--thumb-bg:${c.bg};--thumb-text:${c.text}">${escapeHtml(s.kicker)}<br>${escapeHtml(shortTopic(s.title.replace(/\n/g,' ')))}</span><small>${i+1}</small></button>`;
  }).join('') + '<button class="slide-thumb add-thumb" id="addThumb" aria-label="카드 추가">＋</button>';
  $$('.slide-thumb[data-index]').forEach(b => b.onclick = () => { current = Number(b.dataset.index); originalSlide = {...slides[current]}; render(); });
  $('#addThumb').onclick = addSlide;
}

function generate(e) {
  e?.preventDefault();
  document.body.classList.add('is-generating');
  const btn = $('.generate-button span:nth-child(2)');
  const old = btn.innerHTML;
  btn.innerHTML = '스토리를 구성 중이에요<small>핵심 내용을 카드로 나누는 중</small>';
  setTimeout(() => {
    slides = buildSlides($('#topicInput').value, $('#audienceSelect').value, $('#toneSelect').value, Number($('#slideRange').value));
    current = 0;
    originalSlide = {...slides[0]};
    $('#projectTitle').textContent = shortTopic(cleanTopic($('#topicInput').value));
    render();
    document.body.classList.remove('is-generating');
    btn.innerHTML = old;
    showToast(`${slides.length}장의 카드뉴스가 완성됐어요!`);
  }, 650);
}

function addSlide() {
  const i = current + 1;
  slides.splice(i, 0, { id: Date.now(), kicker:'NEW STORY', title:'새로운 이야기를\n입력해 주세요', body:'오른쪽 편집 패널에서 이 카드의 내용을 자유롭게 바꿀 수 있어요.', layout:'center', theme:'forest', category:`STORY ${String(i).padStart(2,'0')}` });
  current = i; originalSlide = {...slides[current]}; render(); showToast('새 카드가 추가됐어요.');
}

function updateText(key, value) { slides[current][key] = key === 'title' && value.length > 16 ? autoBreak(value) : value; render(); }
function autoBreak(v) { const mid = Math.round(v.length/2); const space = v.indexOf(' ', mid); return space > 0 ? v.slice(0,space)+'\n'+v.slice(space+1) : v; }
function showToast(msg) { const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.classList.remove('show'),2200); }
function saveState(){ localStorage.setItem('cardmate-project', JSON.stringify({slides,current,topic:$('#topicInput').value,title:$('#projectTitle').textContent,ratioKey,brandName,brandPhone})); }

function roundRect(ctx,x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill()}
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines=5) {
  const forced=text.split('\n'); let lines=[];
  forced.forEach(part=>{let line=''; part.split(' ').forEach(word=>{const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test});if(line)lines.push(line)});
  lines.slice(0,maxLines).forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight)); return lines.length*lineHeight;
}

function createSlideCanvas(index=current) {
  const s=slides[index], c=themeMap[s.theme], dimensions=ratios[ratioKey], size=dimensions.width, height=dimensions.height;
  const canvas=document.createElement('canvas'); canvas.width=size; canvas.height=height;
  const ctx=canvas.getContext('2d'); ctx.fillStyle=c.bg;ctx.fillRect(0,0,size,height);
  ctx.globalAlpha=.14;ctx.strokeStyle=c.light;ctx.lineWidth=5;ctx.beginPath();ctx.arc(975,225,245,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
  ctx.font='700 24px "Noto Sans KR",sans-serif';ctx.fillStyle=c.text;ctx.letterSpacing='2px';roundRect(ctx,90,75,210,45,23,'rgba(255,255,255,.10)');ctx.fillText(s.category,108,106);
  ctx.textAlign='right';ctx.fillText(`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`,990,105);ctx.textAlign='left';
  const center=s.layout==='center'; if(center)ctx.textAlign='center'; const x=center?540:90; const max=center?850:900;
  const kickerY=ratioKey==='portrait'?350:300, titleY=ratioKey==='portrait'?490:450, bodyY=ratioKey==='portrait'?820:720;
  ctx.font='800 34px "Noto Sans KR",sans-serif'; const kw=ctx.measureText(s.kicker).width+45; roundRect(ctx,center?540-kw/2:90,kickerY,kw,62,6,c.pop);ctx.fillStyle='#17263c';ctx.fillText(s.kicker,center?540:112,kickerY+43);
  ctx.fillStyle=c.text;ctx.font='900 78px "Noto Sans KR",sans-serif';wrapText(ctx,s.title,x,titleY,max,100,3);
  ctx.fillStyle=c.text;ctx.font='600 31px "Noto Sans KR",sans-serif';wrapText(ctx,s.body,x,bodyY,max,52,4);
  ctx.font='700 22px "Noto Sans KR",sans-serif';ctx.textAlign='left';ctx.fillText([brandName.trim(),brandPhone.trim()].filter(Boolean).join(' · ')||'@cardmate.studio',90,height-80);ctx.textAlign='right';ctx.fillText('SWIPE →',990,height-80);
  return canvas;
}

async function downloadSlide(index=current) {
  const canvas=createSlideCanvas(index);
  const link=document.createElement('a');link.download=`cardmate-${String(index+1).padStart(2,'0')}.png`;link.href=canvas.toDataURL('image/png');link.click();showToast(`${index+1}번 카드를 저장했어요.`);
}

const pngBlob = canvas => new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG 생성 실패')),'image/png'));
const crcTable=Uint32Array.from({length:256},(_,index)=>{let crc=index;for(let bit=0;bit<8;bit+=1)crc=(crc>>>1)^((crc&1)?0xedb88320:0);return crc});
function crc32(data){let crc=0xffffffff;for(const byte of data)crc=(crc>>>8)^crcTable[(crc^byte)&0xff];return(crc^0xffffffff)>>>0}
async function makeZip(files){const blocks=[],directory=[],encoder=new TextEncoder();let offset=0,directorySize=0;for(const{name,blob}of files){const filename=encoder.encode(name),bytes=new Uint8Array(await blob.arrayBuffer()),crc=crc32(bytes),local=new DataView(new ArrayBuffer(30));local.setUint32(0,0x04034b50,true);local.setUint16(4,20,true);local.setUint16(6,0x800,true);local.setUint32(14,crc,true);local.setUint32(18,bytes.length,true);local.setUint32(22,bytes.length,true);local.setUint16(26,filename.length,true);blocks.push(local.buffer,filename,bytes);const entry=new DataView(new ArrayBuffer(46));entry.setUint32(0,0x02014b50,true);entry.setUint16(4,20,true);entry.setUint16(6,20,true);entry.setUint16(8,0x800,true);entry.setUint32(16,crc,true);entry.setUint32(20,bytes.length,true);entry.setUint32(24,bytes.length,true);entry.setUint16(28,filename.length,true);entry.setUint32(42,offset,true);directory.push(entry.buffer,filename);directorySize+=entry.byteLength+filename.length;offset+=local.byteLength+filename.length+bytes.length}const end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,directorySize,true);end.setUint32(16,offset,true);return new Blob([...blocks,...directory,end.buffer],{type:'application/zip'})}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
async function downloadAll(){const buttons=[$('#downloadAllBtn'),$('#downloadTopBtn')];buttons.forEach(button=>button.disabled=true);try{const files=[];for(let index=0;index<slides.length;index+=1)files.push({name:`${String(index+1).padStart(2,'0')}.png`,blob:await pngBlob(createSlideCanvas(index))});const name=cleanTopic($('#topicInput').value).replace(/[^\p{L}\p{N}\s_-]/gu,'').trim().replace(/\s+/g,'-').slice(0,40)||'cardmate';downloadBlob(await makeZip(files),`${name}.zip`);showToast(`카드 ${slides.length}장을 ZIP으로 저장했어요.`)}catch{showToast('전체 저장에 실패했어요. 다시 시도해 주세요.')}finally{buttons.forEach(button=>button.disabled=false)}}

$('#generatorForm').addEventListener('submit', generate);
$('#topicInput').addEventListener('input', e => $('#charCount').textContent=`${e.target.value.length} / 80`);
$$('.suggestions button').forEach(b => b.onclick=()=>{ $('#topicInput').value=b.dataset.topic; $('#charCount').textContent=`${b.dataset.topic.length} / 80`; });
$('#slideRange').oninput=e=>$('#slideCountLabel').textContent=`${e.target.value}장`;
$('#prevSlide').onclick=()=>{current=(current-1+slides.length)%slides.length;originalSlide={...slides[current]};render()};
$('#nextSlide').onclick=()=>{current=(current+1)%slides.length;originalSlide={...slides[current]};render()};
$('#addSlideBtn').onclick=addSlide;
$('#moveLeftBtn').onclick=()=>{if(current<=0)return;[slides[current-1],slides[current]]=[slides[current],slides[current-1]];current-=1;render();showToast('카드를 앞으로 옮겼어요.')};
$('#moveRightBtn').onclick=()=>{if(current>=slides.length-1)return;[slides[current+1],slides[current]]=[slides[current],slides[current+1]];current+=1;render();showToast('카드를 뒤로 옮겼어요.')};
$('#deleteSlideBtn').onclick=()=>{if(slides.length<=3)return showToast('카드는 최소 3장까지 유지할 수 있어요.');slides.splice(current,1);current=Math.min(current,slides.length-1);originalSlide={...slides[current]};render();showToast('카드를 삭제했어요.')};
$('#kickerEdit').oninput=e=>updateText('kicker',e.target.value);
$('#titleEdit').oninput=e=>updateText('title',e.target.value);
$('#bodyEdit').oninput=e=>updateText('body',e.target.value);
$$('.palette').forEach(b=>b.onclick=()=>{slides[current].theme=b.dataset.theme;render()});
$$('.layout-choice').forEach(b=>b.onclick=()=>{slides[current].layout=b.dataset.layout;render()});
$('#resetCardBtn').onclick=()=>{if(originalSlide){slides[current]={...originalSlide};render();showToast('현재 카드를 되돌렸어요.')}};
$('#zoomIn').onclick=()=>{zoom=Math.min(100,zoom+6);$('#zoomValue').textContent=zoom+'%';$('#cardFrame').style.transform=`scale(${zoom/82})`};
$('#zoomOut').onclick=()=>{zoom=Math.max(58,zoom-6);$('#zoomValue').textContent=zoom+'%';$('#cardFrame').style.transform=`scale(${zoom/82})`};
$('#ratioSelect').onchange=e=>{ratioKey=ratios[e.target.value]?e.target.value:'portrait';render();showToast(ratioKey==='portrait'?'인스타 피드 추천 4:5를 적용했어요.':'정사각형 1:1을 적용했어요.')};
$('#brandNameInput').oninput=e=>{brandName=e.target.value;render()};
$('#brandPhoneInput').oninput=e=>{brandPhone=e.target.value;render()};
$('#downloadBtn').onclick=()=>downloadSlide(); $('#downloadTopBtn').onclick=downloadAll; $('#downloadAllBtn').onclick=downloadAll;
$('#copyCaptionBtn').onclick=async()=>{const topic=cleanTopic($('#topicInput').value),compact=v=>v.replace(/[^\p{L}\p{N}]/gu,'').slice(0,28),hashtags=[...new Set([compact(topic),compact(brandName),'카드뉴스','부동산정보','저장해두세요'].filter(Boolean))].slice(0,5);const caption=`${topic}\n\n${slides.map((s,i)=>`${i+1}. ${s.title.replace(/\n/g,' ')}`).join('\n')}\n\n${slides.at(-1)?.body||''}\n\n${[brandName.trim(),brandPhone.trim()].filter(Boolean).join(' | ')}\n\n${hashtags.map(tag=>`#${tag}`).join(' ')}`;try{await navigator.clipboard.writeText(caption)}catch{const area=document.createElement('textarea');area.value=caption;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove()}showToast('게시 설명과 해시태그를 복사했어요.')};
$('#newProjectBtn').onclick=()=>{if(confirm('현재 내용을 비우고 새 프로젝트를 시작할까요?')){localStorage.removeItem('cardmate-project');location.reload()}};
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;if(e.key==='ArrowLeft')$('#prevSlide').click();if(e.key==='ArrowRight')$('#nextSlide').click()});

const saved=localStorage.getItem('cardmate-project');
if(saved){try{const p=JSON.parse(saved);if(p.slides?.length){slides=p.slides;current=Math.min(p.current||0,slides.length-1);ratioKey=ratios[p.ratioKey]?p.ratioKey:'portrait';brandName=typeof p.brandName==='string'?p.brandName:brandName;brandPhone=typeof p.brandPhone==='string'?p.brandPhone:brandPhone;$('#topicInput').value=p.topic||'';$('#projectTitle').textContent=p.title||shortTopic(p.topic);$('#charCount').textContent=`${(p.topic||'').length} / 80`;$('#ratioSelect').value=ratioKey;$('#brandNameInput').value=brandName;$('#brandPhoneInput').value=brandPhone;originalSlide={...slides[current]};render()}}catch(e){localStorage.removeItem('cardmate-project')}}
if(!slides.length){slides=buildSlides($('#topicInput').value,$('#audienceSelect').value,$('#toneSelect').value,7);originalSlide={...slides[0]};render()}
