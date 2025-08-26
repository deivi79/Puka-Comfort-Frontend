import { useEffect, useRef } from 'react'
export default function useReveal(delay=0){
  const ref = useRef(null)
  useEffect(()=>{
    const el = ref.current; if(!el) return
    el.style.transitionDelay = `${delay}ms`
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ el.classList.add('in'); obs.unobserve(el) } })
    },{ rootMargin:'-5% 0px -5% 0px' })
    obs.observe(el); return ()=>obs.disconnect()
  },[delay])
  return ref
}
