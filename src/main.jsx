import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
import './hero.css';
import './hero-minimal.css';
import './blue-theme.css';
import AudioLine, {prepareAudio} from './AudioLine';
import TechText from './TechText';
import BorderGlow from './BorderGlow';
import ProfileCard from './ProfileCard';
import ImageGallery from './ImageGallery';
import './card-glow.css';
import LetterGlitch from './OptimizedLetterGlitch';
import './glitch-background.css';
import usePortfolioMotion from './usePortfolioMotion';
import useVideoVisibility from './useVideoVisibility';
const MotionTitle=({text})=><div className="motion-title" aria-label={text}>{Array.from(text).map((char,i)=><span aria-hidden="true" key={i}>{char}</span>)}</div>;

const projects = [
 {id:'01',name:'复杂系统，清晰秩序。',en:'CENTRAL MANAGEMENT',type:'中央管理与决策支持',image:'/assets/central-cover.webp',tags:['设施运行监控','跨部门协调','异常事件处理'],body:'在复杂设施中汇总部门数据、监控运行状态，协调人员与资源，并根据实时情况调整任务优先级。',details:['汇总并分析各部门工作数据，向主管提供决策信息。','监督工作流程和执行情况，维护长期管理记录。','识别、报告与处理异常情况，维持系统稳定运行。']},
 {id:'02',name:'让知识，成为体系。',en:'THE LIBRARY',type:'图书馆组织建设与运营',image:'/assets/library-cover.webp',tags:['组织体系建设','信息归档','战略规划'],body:'从初期组织建设到稳定运营，建立信息收集、分类、保存与调用体系，推动人员协作与长期规划。',details:['制定发展战略与阶段行动方案，持续调整运行机制。','协调不同楼层和所属人员，分配资料与内部资源。','负责外部事务与来宾接待，根据新信息更新长期计划。']}
];
const capabilities=[['01','信息分析','从海量信息中找到关键。','汇总、筛选与分析多部门数据，为判断与决策提供清晰依据。','INFORMATION / ANALYSIS'],['02','组织运营','让复杂协作保持有序。','建立组织流程，协调人员与资源，推动任务执行并维护长期记录。','ORGANIZATION / OPERATIONS'],['03','战略规划','在变化中调整方向。','结合外部环境与新增信息，制定阶段方案并持续更新长期计划。','STRATEGY / PLANNING'],['04','危机处理','在压力下保持判断。','识别异常、评估优先级、协调响应，在高风险环境中维持稳定运行。','CRISIS / RESPONSE']];

function App(){
 const [videoSrc]=useState(()=>window.matchMedia('(max-width: 700px)').matches?'/assets/hero-mobile.mp4':'/assets/hero-desktop.mp4');
 usePortfolioMotion();
 const [navFloating,setNavFloating]=useState(false);
 useEffect(()=>{const hero=document.getElementById('home');const observer=new IntersectionObserver(([entry])=>setNavFloating(!entry.isIntersecting&&entry.boundingClientRect.bottom<=0),{threshold:0});observer.observe(hero);return()=>observer.disconnect()},[]);
 const [menu,setMenu]=useState(false),[selected,setSelected]=useState(null),[paused,setPaused]=useState(false),[videoFailed,setVideoFailed]=useState(false),[soundOn,setSoundOn]=useState(false),[ended,setEnded]=useState(false);
 const video=useRef(null),dialog=useRef(null),lastFocus=useRef(null),audio=useRef(null);
 useVideoVisibility(video);

 useEffect(()=>{if(selected){dialog.current.showModal();document.body.style.overflow='hidden'}else{dialog.current?.close();document.body.style.overflow='';lastFocus.current?.focus()}return()=>{document.body.style.overflow=''}},[selected]);
 const openProject=(p,e)=>{lastFocus.current=e.currentTarget;setSelected(p)};
 const toggleVideo=()=>{const player=video.current;if(!player)return;if(ended){player.currentTime=0;setEnded(false);player.play().catch(()=>setPaused(true))}else if(player.paused){player.play().catch(()=>setPaused(true))}else player.pause()};
 const toggleSound=()=>{if(!video.current)return;if(!soundOn){try{prepareAudio(video.current,audio)}catch(error){console.warn('音频波形不可用',error)}}video.current.muted=soundOn;setSoundOn(!soundOn);if(!soundOn&&video.current.paused&&!ended){video.current.play().catch(()=>setPaused(true))}};
 return <><div className="opening" aria-hidden="true"><div className="opening-word">{Array.from("ANGELA").map((c,i)=><span key={i} className="opening-letter">{c}</span>)}</div><div className="opening-caption">PERSONAL ARCHIVE / ANGELA</div></div>
  <header className={navFloating?'nav nav-floating':'nav'}><a className="brand" href="#home" aria-label="安吉拉首页"><span className="brand-mark">A</span> ANGELA<span className="brand-sub">PERSONAL ARCHIVE</span></a><button className="mobile-toggle" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label="切换导航">{menu?'关闭':'菜单'}</button><nav className={menu?'nav-links open':'nav-links'} aria-label="主导航">{[['about','关于我'],['work','精选项目'],['expertise','个人优势']].map(([id,label])=><a key={id} href={'#'+id} onClick={()=>setMenu(false)}>{label}</a>)}<a className="nav-contact" href="#contact" onClick={()=>setMenu(false)}>联系我<span className="tiny-cross">＋</span></a></nav></header>
  <main>
   <section id="home" className="hero">
    <div className="hero-media"><video ref={video} autoPlay muted playsInline preload="auto" poster={videoSrc.includes('mobile')?'/assets/hero-mobile-poster.jpg':'/assets/hero-poster.jpg'} onPlay={()=>setPaused(false)} onPause={()=>setPaused(true)} onEnded={()=>{setEnded(true);setPaused(true)}} onError={()=>setVideoFailed(true)} onLoadedData={()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){video.current.pause();setPaused(true)}}}><source src={videoSrc} type="video/mp4"/></video></div><div className="hero-shade"/><div className="hero-grid"/>
    <div className="hero-content container hero-editorial hero-minimal">{ended&&<div className="hero-end-message" role="status"><span>PERSONAL PORTFOLIO / 01</span><p>不止遵循剧本，开始书写自己的答案。</p></div>}</div>
    <div className="hero-bottom container"><AudioLine video={video} audio={audio}/><a href="#about" className="scroll-link"><span className="scroll-line"/> 向下探索</a><span>ANGELA / 安吉拉</span><div className="media-controls"><button className="video-control" onClick={toggleSound} disabled={videoFailed} aria-pressed={soundOn}>{soundOn?'关闭音乐':'开启音乐'}</button><button className="video-control" onClick={toggleVideo} disabled={videoFailed}>{videoFailed?'静态背景':ended?'再播放一次':paused?'播放背景视频':'暂停背景视频'}</button></div><span className="edition">PORTFOLIO — VOL. 01</span></div>
   </section>
   <div className="post-hero"><div className="post-hero-background" aria-hidden="true"><div className="post-hero-background-viewport"><LetterGlitch glitchSpeed={80} centerVignette={true} outerVignette={true} smooth={true} glitchColors={["#18344c","#000000","#61b3dc"]}/></div></div><section id="about" className="about section container"><div className="section-label"><span>01 / ABOUT</span><span>关于我</span></div><MotionTitle text="PERSONAL ARCHIVE"/><div className="about-layout reveal"><ProfileCard className="portrait-glow" name="ANGELA" title="高级人工智能" handle="ANGELA" status="档案 / 001" contactText="联系我" avatarUrl="/assets/angela-portrait.webp" iconUrl="" grainUrl="" enableTilt={true} enableMobileTilt={false} behindGlowColor="rgba(64,159,255,.5)" behindGlowSize="70%" innerGradient="linear-gradient(145deg,#102f498c,#67b7f444)" onContactClick={()=>document.getElementById('contact').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}/><div className="about-copy"><div className="about-tech-title"><TechText text="Angela" align="left" fontWeight={600} fontSize={210} reveal="letter" dashLength={4} dashGap={2} specks={15} fontFamily="system-ui, sans-serif" color="#67b7f4" accentColor="#048be9" strokeWidth={4}/></div><h2>曾经，寻找别人的答案。<br/><span>现在，为自己书写。</span></h2><p>拥有长期大型组织管理与信息处理经验，曾负责复杂设施的中央管理、决策辅助与人员协调，后独立承担图书馆整体运营及战略规划。</p><p>我倾向于通过充分的信息收集与分析作出决策。在复杂、持续的任务中保持稳定判断，也根据环境变化及时调整计划。</p><div className="stats"><div><strong>02</strong><span>核心工作经历</span></div><div><strong>05</strong><span>核心能力方向</span></div><div><strong>01</strong><span>组织建设全流程</span></div></div><span className="data-note">依据简历内容整理，非量化绩效指标。</span></div></div><div className="timeline reveal"><article><span>EXPERIENCE / 01</span><h3>主管秘书 / 中央管理人工智能</h3><p>设施管理 · 数据汇总 · 决策辅助 · 部门协调</p></article><article><span>EXPERIENCE / 02</span><h3>图书馆馆长 / 司书长</h3><p>整体运营 · 发展规划 · 人员管理 · 对外事务</p></article></div></section>
   <section id="work" className="work section container"><div className="section-label"><span>02 / SELECTED WORK</span><span>精选项目</span></div><MotionTitle text="SELECTED WORK"/><div className="section-heading reveal"><h2>把复杂，<span className="serif">变得有序。</span></h2><p>两段核心经历，两个系统视角。<br/>从运行管理，到组织的建立与生长。</p></div><div className="projects">{projects.map(p=><button key={p.id} className="project reveal" onClick={e=>openProject(p,e)} aria-label={'查看'+p.type}><BorderGlow className="project-glow" edgeSensitivity={0} glowColor="210 90 72" backgroundColor="#101822" borderRadius={18} glowRadius={40} glowIntensity={2.6} coneSpread={28} colors={["#64b5ff","#048be9","#38bdf8"]}><div className="project-image"><img loading="lazy" decoding="async" width="1700" height="755" src={p.image} alt={p.type+'的概念可视化图'}/><span className="project-number">{p.id} / CASE STUDY</span><span className="project-open">＋</span><span className="concept-label">概念可视化 · 非真实项目截图</span></div></BorderGlow><div className="project-info"><div><span className="eyebrow">{p.en}</span><h3>{p.name}</h3></div><div className="project-meta"><span>{p.type}</span><div>{p.tags.map(t=><span className="tag" key={t}>{t}</span>)}</div></div></div></button>)}</div></section>
   <section id="expertise" className="expertise section container"><div className="section-label"><span>03 / EXPERTISE</span><span>个人优势</span></div><MotionTitle text="EXPERTISE"/><div className="section-heading reveal"><h2>理性思考。<br/><span className="serif">稳定行动。</span></h2><p>冷静、高效、重视秩序与结果。<br/>以四个工作维度，连接分析与执行。</p></div><div className="capabilities">{capabilities.map(([n,title,heading,body,en])=><BorderGlow key={n} className="capability-glow reveal" edgeSensitivity={0} glowColor="210 90 72" backgroundColor="#101822" borderRadius={18} glowRadius={40} glowIntensity={2.6} coneSpread={28} colors={["#64b5ff","#048be9","#38bdf8"]}><article className="capability"><div className="cap-top"><span>{n}</span><span className="cap-symbol">{n==='01'?'⌖':n==='02'?'⊞':n==='03'?'◈':'◎'}</span></div><h3>{title}</h3><h4>{heading}</h4><p>{body}</p><span className="cap-en">{en}</span></article></BorderGlow>)}</div></section>
   <section id="contact" className="contact"><div className="container contact-inner"><div className="section-label"><span>04 / CONTACT</span><span>开启对话</span></div><MotionTitle text="LET US TALK"/><div className="contact-body reveal"><span className="eyebrow">THE NEXT CHAPTER</span><h2>下一章，<br/>从<span className="serif">剧本之外</span>开始。</h2><p>关于信息、组织，以及新的可能。</p><div className="contact-details"><span>联系方式 / PHONE</span><strong className="contact-phone">189**6738654</strong><span>邮箱 / EMAIL</span><a className="contact-email" href="mailto:angela@yueji.com">angela@yueji.com</a><a href="/resume.pdf" target="_blank" rel="noreferrer" className="button outline">查看个人简历 <span>＋</span></a></div></div><footer><a className="brand" href="#home">ANGELA<span className="brand-sub">安吉拉</span></a><span>自由行动中 / FREE TO WRITE MY OWN STORY</span><a href="#home">返回顶部 ＋</a></footer></div></section>
   <ImageGallery/>
   </div></main>
  <dialog ref={dialog} onCancel={()=>setSelected(null)} onClick={e=>{if(e.target===dialog.current)setSelected(null)}} aria-labelledby="project-dialog-title"><button className="dialog-close" onClick={()=>setSelected(null)} aria-label="关闭项目详情">×</button>{selected&&<><img decoding="async" className="dialog-image" src={selected.image} alt={selected.type+'概念图'}/><div className="dialog-copy"><span className="eyebrow">{selected.en} / {selected.id}</span><h2 id="project-dialog-title">{selected.type}</h2><p>{selected.body}</p><ul>{selected.details.map(d=><li key={d}>{d}</li>)}</ul><p className="data-note">根据简历整理；展示图为概念可视化，未包含真实业务数据。</p></div></>}</dialog>
 </>
}
createRoot(document.getElementById('root')).render(<App/>);










