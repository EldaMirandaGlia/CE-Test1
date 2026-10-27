/* NexusBank demo interactions. All data and storage are browser-local. */
(() => {
  'use strict';

  const PAGES = {main:'Main',credit:'Credit Card',mortgages:'Mortgages',payroll:'Payroll',fraud:'Fraud & Disputes'};
  const page = document.body.dataset.page || 'main';
  const USD = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});
  const today = () => new Date().toISOString().slice(0,10);
  const fmtDate = date => new Date(date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  const asMoney = amount => USD.format(Number(amount)||0);
  const transactions = [
    {id:'T-401',date:'2026-10-23',name:'MERIDIAN MARKET',category:'Retail purchase',amount:-184.60},
    {id:'T-402',date:'2026-10-22',name:'NORTHLINE DIGITAL',category:'Online services',amount:-79.99},
    {id:'T-403',date:'2026-10-19',name:'HARBOR COFFEE',category:'Food & beverage',amount:-18.40},
    {id:'T-404',date:'2026-10-17',name:'AVENUE AIRLINES',category:'Travel',amount:-426.80},
    {id:'T-405',date:'2026-10-14',name:'PARKSIDE GROCERY',category:'Groceries',amount:-96.28}
  ];
  const STATUS = ['Submitted','Under Review','Additional Information Required','Resolved','Closed'];
  const label = s => ({'Submitted':'gray','Under Review':'warn','Additional Information Required':'danger','Resolved':'success','Closed':'gray'}[s]||'gray');
  const byId = id => document.getElementById(id);
  const get = (key,fallback) => {try{const v=localStorage.getItem('nexusbank:'+key);return v?JSON.parse(v):fallback;}catch{return fallback;}};
  const put = (key,value) => {try{localStorage.setItem('nexusbank:'+key,JSON.stringify(value));return true;}catch{toast('Browser storage is unavailable; changes will last until refresh.');return false;}};
  const create = (tag,css,text) => {const el=document.createElement(tag);if(css)el.className=css;if(text!==undefined)el.textContent=text;return el;};

  function toast(message){let el=byId('toast');if(!el){el=create('div','toast');el.id='toast';el.setAttribute('role','status');document.body.appendChild(el);}el.textContent=message;el.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>{el.hidden=true;},3900);}

  const navToggle=byId('menuToggle');
  if(navToggle){navToggle.addEventListener('click',()=>{const nav=byId('mainNav');const isOpen=nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(isOpen));navToggle.setAttribute('aria-label',isOpen?'Close navigation':'Open navigation');});}
  document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{byId('mainNav')?.classList.remove('open');navToggle?.setAttribute('aria-expanded','false');}));

  // A single reusable native dialog hosts all demo flows on every page.
  const modal=byId('demoModal');
  if(modal){
    modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});
    modal.addEventListener('close',()=>{const active=document.querySelector('[data-return-focus="true"]');active?.focus();active?.removeAttribute('data-return-focus');});
  }
  function openModal(title,html,from){
    if(!modal)return;
    if(from)from.dataset.returnFocus='true';
    byId('modalTitle').textContent=title;
    byId('modalBody').innerHTML=html; // Template strings below contain only fixed, authored markup.
    if(!modal.open)modal.showModal();
    const field=byId('modalBody').querySelector('input,select,textarea,button');
    field?.focus();
  }
  function confirm(title,message,reference){
    openModal(title,'<div class="confirmation"><div class="check-circle" aria-hidden="true">✓</div><h3 id="confirmHeading"></h3><p id="confirmText"></p><p class="pill" id="confirmRef"></p><div class="modal-actions"><button type="button" class="btn btn-dark" id="confirmDone">Done</button></div></div>');
    byId('confirmHeading').textContent=title;
    byId('confirmText').textContent=message;
    const ref=byId('confirmRef');if(reference)ref.textContent=reference;else ref.hidden=true;
    byId('confirmDone').addEventListener('click',()=>modal.close());
  }
  const demoNotice='<p class="fineprint">Simulation only. This form is not sent to a real bank or support team. Please do not enter sensitive or real account information.</p>';
  document.querySelectorAll('[data-open-problem]').forEach(btn=>btn.addEventListener('click',()=>{
    openModal('Report a Problem',`<form id="problemForm"><div class="field"><label for="originPage">Page of origin</label><input id="originPage" readonly></div><div class="field"><label for="problemCategory">Problem category</label><select id="problemCategory" required><option value="" disabled selected>Select a category</option><option>Interface or display</option><option>Navigation</option><option>Calculator or interactive feature</option><option>Accessibility</option><option>Other issue</option></select></div><div class="field"><label for="problemDescription">Describe the problem</label><textarea id="problemDescription" required minlength="10" maxlength="1000" placeholder="Tell us what happened in this simulation (do not include personal information)."></textarea></div>${demoNotice}<div class="modal-actions"><button type="button" class="btn btn-outline" data-close-modal>Cancel</button><button class="btn" type="submit">Submit Report</button></div></form>`,btn);
    byId('originPage').value=PAGES[page];
    byId('problemForm').addEventListener('submit',e=>{e.preventDefault();const reports=get('problem-reports',[]);const ref='PR-DEMO-'+Date.now().toString().slice(-7);reports.unshift({reference:ref,page:PAGES[page],category:byId('problemCategory').value,description:byId('problemDescription').value,date:today()});put('problem-reports',reports);confirm('Report recorded','Your demonstration platform issue was saved in this browser. Nothing was sent to a real institution.',ref);});
  }));
  modal?.addEventListener('click',e=>{if(e.target.closest('[data-close-modal]'))modal.close();});

  // Credit-card comparison and reward illustration.
  if(page==='credit'){
    const products={everyday:{name:'Nexus Everyday',fee:'$0',apr:'18.49%–28.49%',rewards:'1.5% cash back',intro:'No annual fee'},voyage:{name:'Nexus Voyage',fee:'$95',apr:'19.49%–29.49%',rewards:'3× travel points',intro:'Travel-oriented rewards'},reserve:{name:'Nexus Reserve',fee:'$250',apr:'20.49%–29.49%',rewards:'4× select experiences',intro:'Premium lifestyle benefits'}};
    const chosen=new Set(['everyday','voyage']);
    const drawCompare=()=>{
      document.querySelectorAll('.product-card[data-card]').forEach(card=>{const selected=chosen.has(card.dataset.card);card.classList.toggle('selected',selected);card.querySelector('.select-card').setAttribute('aria-pressed',String(selected));card.querySelector('.select-card').textContent=selected?'Selected for comparison':'Compare this card';});
      const table=byId('compareTable');const items=[...chosen].map(id=>products[id]);
      byId('compareCount').textContent=`${items.length} of 2 selected`;
      if(items.length===0){table.innerHTML='<p class="muted">Choose up to two cards above to compare their illustrative terms.</p>';return;}
      const rows=[['Card',...items.map(x=>x.name)],['Annual fee',...items.map(x=>x.fee)],['Variable purchase APR',...items.map(x=>x.apr)],['Rewards',...items.map(x=>x.rewards)],['Highlights',...items.map(x=>x.intro)]];
      const t=create('table','comparison');const tb=create('tbody');rows.forEach((row,i)=>{const tr=create('tr');row.forEach((value,j)=>{const cell=create(j===0?'th':'td','',value);if(j===0)cell.scope='row';if(i===0&&j>0)cell.style.color='#315db1';tr.appendChild(cell);});tb.appendChild(tr);});t.appendChild(tb);table.replaceChildren(t);
    };
    document.querySelectorAll('.select-card').forEach(button=>button.addEventListener('click',()=>{const id=button.closest('[data-card]').dataset.card;if(chosen.has(id))chosen.delete(id);else if(chosen.size===2){toast('Select a maximum of two cards to compare.');return;}else chosen.add(id);drawCompare();}));drawCompare();
    const spend=byId('monthlySpend');const rate=byId('rewardRate');
    const calculate=()=>{const amount=Number(spend.value)||0;const pct=Number(rate.value);byId('spendValue').textContent=asMoney(amount);byId('rewardValue').textContent=asMoney(amount*12*pct/100);byId('rewardDescription').textContent=`At ${pct.toFixed(1)}% illustrative cash back, before any fees or limits.`;};
    spend?.addEventListener('input',calculate);rate?.addEventListener('change',calculate);calculate();
  }

  // Mortgage payment model: principal + interest + estimated taxes/insurance/PMI.
  if(page==='mortgages'){
    const mortgages={fixed30:{years:30,rate:6.45,name:'30-Year Fixed'},fixed15:{years:15,rate:5.95,name:'15-Year Fixed'},fha:{years:30,rate:6.15,name:'FHA-Style Demo'}};
    let selected='fixed30';
    const ids=['homePrice','downPct','annualTaxes','annualInsurance'];
    const calc=()=>{
      const price=Math.max(0,Number(byId('homePrice').value)||0);const pct=Math.min(100,Math.max(0,Number(byId('downPct').value)||0));const down=price*pct/100;const principal=Math.max(0,price-down);const m=mortgages[selected];const r=m.rate/1200;const n=m.years*12;
      const pi=principal===0?0:r===0?principal/n:principal*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
      const tax=Math.max(0,Number(byId('annualTaxes').value)||0)/12;const insurance=Math.max(0,Number(byId('annualInsurance').value)||0)/12;const pmi=pct<20?principal*.005/12:0;const total=pi+tax+insurance+pmi;
      byId('paymentTotal').textContent=asMoney(total);byId('paymentPrincipal').textContent=asMoney(pi);byId('paymentTaxes').textContent=asMoney(tax);byId('paymentInsurance').textContent=asMoney(insurance);byId('paymentPmi').textContent=asMoney(pmi);byId('loanAmount').textContent=asMoney(principal);byId('downAmount').textContent=asMoney(down);byId('calcRate').textContent=`${m.rate.toFixed(2)}% illustrative rate · ${m.years} years`;
      [['principalBar',pi],['taxBar',tax+insurance],['pmiBar',pmi]].forEach(([id,value])=>byId(id).style.width=(total?value/total*100:0)+'%');
    };
    ids.forEach(id=>byId(id)?.addEventListener('input',calc));
    document.querySelectorAll('[data-mortgage]').forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.mortgage;document.querySelectorAll('[data-mortgage]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});calc();}));calc();
  }

  // Fictional payroll activity, allocation, and direct-deposit setup.
  if(page==='payroll'){
    document.querySelectorAll('[data-payroll-filter]').forEach(btn=>btn.addEventListener('click',()=>{const filter=btn.dataset.payrollFilter;document.querySelectorAll('[data-payroll-filter]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});document.querySelectorAll('#payrollTable tbody tr').forEach(tr=>{tr.hidden=filter!=='all'&&tr.dataset.kind!==filter;});}));
    const slider=byId('allocationSlider');const alloc=()=>{const total=3820.40;const pct=Number(slider.value);byId('checkingPct').textContent=pct+'%';byId('savingsPct').textContent=(100-pct)+'%';byId('checkingAllocated').textContent=asMoney(total*pct/100);byId('savingsAllocated').textContent=asMoney(total*(100-pct)/100);byId('allocationBar').style.width=pct+'%';};slider?.addEventListener('input',alloc);alloc();
    const setup=byId('depositSetup');setup?.addEventListener('click',()=>{openModal('Direct Deposit Setup — Demo',`<div class="alert-banner"><span aria-hidden="true">ⓘ</span><div>This is a sample setup preview. No employer instructions are generated or transmitted.</div></div><div class="form-grid space-top"><div class="field"><label>Account</label><div class="read-field">Nexus Payroll Checking •• 2048</div></div><div class="field"><label>Routing number</label><div class="read-field">000000000 (fictional)</div></div></div><div class="field"><label for="depositFrequency">Pay frequency</label><select id="depositFrequency"><option>Biweekly</option><option>Weekly</option><option>Semimonthly</option><option>Monthly</option></select></div>${demoNotice}<div class="modal-actions"><button type="button" class="btn btn-outline" data-close-modal>Cancel</button><button type="button" class="btn" id="saveDepositDemo">Save Demo Setup</button></div>`,setup);byId('saveDepositDemo').addEventListener('click',()=>{put('payroll-setup',{frequency:byId('depositFrequency').value,date:today()});confirm('Setup saved','Your fictional direct-deposit preference is saved in this browser. No employer or bank was contacted.');byId('depositStatus').textContent='Demo setup saved';});});
    if(get('payroll-setup',null))byId('depositStatus').textContent='Demo setup saved';
  }

  // Fraud and dispute case management remains deliberately separate from platform issue reports.
  if(page==='fraud'){
    const samples=[
      {reference:'NX-2026-1042',kind:'Fraud',type:'Unrecognized card purchase',transactionId:'T-401',description:'Demo inquiry about an unfamiliar retail charge.',created:'2026-10-23',status:'Under Review',updates:[{title:'Under Review',date:'2026-10-24',text:'A demonstration specialist began reviewing the sample activity.'},{title:'Submitted',date:'2026-10-23',text:'Demo case created successfully.'}]},
      {reference:'NX-2026-1041',kind:'Dispute',type:'Item not received',transactionId:'T-404',description:'Demo purchase delivery dispute.',created:'2026-10-17',status:'Additional Information Required',updates:[{title:'Additional Information Required',date:'2026-10-21',text:'Additional details requested in this simulation.'},{title:'Under Review',date:'2026-10-19',text:'Review started.'},{title:'Submitted',date:'2026-10-17',text:'Demo dispute created.'}]},
      {reference:'NX-2026-1038',kind:'Fraud',type:'Account takeover attempt',transactionId:'',description:'Demo suspicious access report.',created:'2026-10-12',status:'Resolved',updates:[{title:'Resolved',date:'2026-10-16',text:'Simulated review completed.'},{title:'Under Review',date:'2026-10-13',text:'Review started.'},{title:'Submitted',date:'2026-10-12',text:'Demo case submitted.'}]}
    ];
    let cases=get('cases',null);if(!Array.isArray(cases)){cases=samples;put('cases',cases);}
    let active=cases[0]?.reference;
    const transactionName=id=>{const t=transactions.find(x=>x.id===id);return t?`${t.name} · ${asMoney(Math.abs(t.amount))}`:'No specific transaction';};
    const statusPill=s=>{const badge=create('span','pill '+label(s),s);return badge;};
    const addCase=(kind,type,transactionId,description,date)=>{
      const reference='NX-DEMO-'+Date.now().toString().slice(-8);
      cases.unshift({reference,kind,type,transactionId,description,created:date,status:'Submitted',updates:[{title:'Submitted',date:today(),text:'Your demonstration case was created locally in this browser.'}]});put('cases',cases);active=reference;renderCases();return reference;
    };
    const renderCases=()=>{
      byId('caseCount').textContent=`${cases.length} demo cases`;
      const list=byId('caseItems');list.replaceChildren();
      cases.forEach(item=>{const b=create('button','case-item');b.type='button';b.setAttribute('aria-pressed',String(active===item.reference));const top=create('div','case-top');top.append(create('b','',item.reference),statusPill(item.status));b.append(top,create('div','case-meta',`${item.kind} · ${fmtDate(item.created)}`));b.addEventListener('click',()=>{active=item.reference;renderCases();});list.append(b);});
      const c=cases.find(x=>x.reference===active)||cases[0];const detail=byId('caseDetail');detail.replaceChildren();if(!c){detail.append(create('div','empty-state','No demo cases yet.'));return;}
      const head=create('div','detail-header');const copy=create('div');copy.append(create('span','upper muted',c.kind+' CASE'),create('h3','',c.type),create('div','case-ref',`${c.reference} · Created ${fmtDate(c.created)}`));head.append(copy,statusPill(c.status));detail.append(head);
      detail.append(create('p','fraud-note',`Transaction: ${transactionName(c.transactionId)}`));
      const timeline=create('ol','timeline');c.updates.forEach(update=>{const item=create('li');item.append(create('strong','',update.title),create('span','',update.text));const time=create('time','',fmtDate(update.date));time.dateTime=update.date;item.append(time);timeline.append(item);});detail.append(timeline);
      const button=create('button','btn btn-quiet btn-sm',c.status==='Closed'?'Case Closed':'Advance Demo Status');button.type='button';button.disabled=c.status==='Closed';button.addEventListener('click',()=>{const idx=STATUS.indexOf(c.status);c.status=STATUS[Math.min(idx+1,STATUS.length-1)];c.updates.unshift({title:c.status,date:today(),text:({ 'Under Review':'Simulated analyst review started.','Additional Information Required':'Demo requests further details.','Resolved':'This sample investigation is marked resolved.','Closed':'The demonstration case is now closed.'})[c.status]||'Status changed.'});put('cases',cases);renderCases();toast('Case status updated for this demonstration.');});detail.append(button,create('p','fraud-note','Advance is a testing control; real banking cases cannot be updated this way.'));
    };
    const optionMarkup=includeNone=>`${includeNone?'<option value="">No specific transaction</option>':''}${transactions.map(t=>`<option value="${t.id}">${t.date} · ${t.name} · ${asMoney(Math.abs(t.amount))}</option>`).join('')}`;
    const reportBtn=byId('reportFraudBtn');reportBtn?.addEventListener('click',()=>{
      openModal('Report Fraud — Demo',`<form id="fraudForm"><div class="field"><label for="fraudType">Type of suspected fraud</label><select id="fraudType" required><option value="" disabled selected>Choose an incident</option><option>Unrecognized card purchase</option><option>Account takeover attempt</option><option>Identity theft concern</option><option>Phishing or impersonation</option><option>Other suspicious activity</option></select></div><div class="form-grid"><div class="field"><label for="fraudDate">Incident date</label><input type="date" id="fraudDate" required></div><div class="field"><label for="fraudTransaction">Fictional transaction</label><select id="fraudTransaction">${optionMarkup(true)}</select></div></div><div class="field"><label for="fraudDescription">What happened?</label><textarea id="fraudDescription" required minlength="10" maxlength="1200" placeholder="Describe only a fictional scenario; do not include any real financial details."></textarea></div>${demoNotice}<div class="modal-actions"><button type="button" class="btn btn-outline" data-close-modal>Cancel</button><button class="btn" type="submit">Create Demo Fraud Case</button></div></form>`,reportBtn);
      byId('fraudDate').value=today();byId('fraudDate').max=today();
      byId('fraudForm').addEventListener('submit',e=>{e.preventDefault();const ref=addCase('Fraud',byId('fraudType').value,byId('fraudTransaction').value,byId('fraudDescription').value,byId('fraudDate').value);confirm('Fraud case created','Your fictional report was recorded in this browser. This is not a real fraud claim, and no bank has been notified.',ref);});
    });
    const openDispute=(id,from)=>{
      openModal('Dispute a Transaction — Demo',`<form id="disputeForm"><div class="field"><label for="disputeTransaction">Select a sample transaction</label><select id="disputeTransaction" required>${optionMarkup(false)}</select></div><div class="field"><label for="disputeReason">Reason for dispute</label><select id="disputeReason" required><option value="" disabled selected>Select a reason</option><option>Item not received</option><option>Duplicate charge</option><option>Incorrect amount</option><option>Service not provided</option><option>Credit not processed</option><option>Other transaction issue</option></select></div><div class="field"><label for="disputeDescription">Explain your dispute</label><textarea id="disputeDescription" required minlength="10" maxlength="1200" placeholder="Describe a made-up dispute, without real payment data."></textarea></div>${demoNotice}<div class="modal-actions"><button type="button" class="btn btn-outline" data-close-modal>Cancel</button><button class="btn" type="submit">Submit Demo Dispute</button></div></form>`,from);
      if(id)byId('disputeTransaction').value=id;
      byId('disputeForm').addEventListener('submit',e=>{e.preventDefault();const ref=addCase('Dispute',byId('disputeReason').value,byId('disputeTransaction').value,byId('disputeDescription').value,today());confirm('Dispute submitted','The fictional transaction dispute was added to your demo case tracker. No real charge has been disputed.',ref);});
    };
    byId('disputeBtn')?.addEventListener('click',e=>openDispute('',e.currentTarget));
    document.querySelectorAll('[data-dispute-txn]').forEach(button=>button.addEventListener('click',()=>openDispute(button.dataset.disputeTxn,button)));
    const lock=byId('lockCard');const renderLock=()=>{const locked=get('card-locked',false);byId('cardLockState').textContent=locked?'Demo card locked — click to unlock':'Freeze a fictional card temporarily';lock.setAttribute('aria-pressed',String(locked));lock.querySelector('strong').textContent=locked?'Unlock Card':'Lock Card';};
    lock?.addEventListener('click',()=>{const next=!get('card-locked',false);put('card-locked',next);renderLock();toast(next?'Fictional card locked in this browser.':'Fictional card unlocked.');});renderLock();
    byId('reviewActivity')?.addEventListener('click',()=>{byId('recentActivity').scrollIntoView({behavior:'smooth',block:'start'});toast('Showing fictional recent transactions below.');});
    byId('secureAccount')?.addEventListener('click',e=>{openModal('Secure Account — Demo',`<p class="muted">Explore what a bank might recommend after suspicious activity. These are educational controls only.</p><label class="field-label"><input type="checkbox" class="security-check"> Review recent demo transactions</label><p></p><label class="field-label"><input type="checkbox" class="security-check"> Learn how to update real passwords through official channels</label><p></p><label class="field-label"><input type="checkbox" class="security-check"> Review multi-factor authentication guidance</label><p></p>${demoNotice}<div class="modal-actions"><button type="button" class="btn" id="finishSecurity">Finish Checklist</button></div>`,e.currentTarget);byId('finishSecurity').addEventListener('click',()=>{const all=[...document.querySelectorAll('.security-check')].every(c=>c.checked);if(!all){toast('Complete all demo checklist items first.');return;}confirm('Checklist complete','Your educational security checklist is complete. No account settings were changed.');});});
    byId('contactSupport')?.addEventListener('click',e=>{openModal('Contact Support — Simulation',`<div class="alert-banner warning"><span aria-hidden="true">!</span><div><strong>Not a real support channel</strong> NexusBank is fictional. Do not use this site for an urgent fraud report.</div></div><p>If an incident affects a real account, use the official phone number on your card or your financial institution’s verified app or website. For US identity-theft resources, visit <a href="https://www.identitytheft.gov/" target="_blank" rel="noopener noreferrer" class="link-arrow">IdentityTheft.gov</a>.</p>${demoNotice}<div class="modal-actions"><button type="button" class="btn btn-dark" data-close-modal>Understood</button></div>`,e.currentTarget);});
    renderCases();
  }
})();
