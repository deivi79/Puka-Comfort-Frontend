import { useEffect, useState } from 'react'
import { api } from '../api'
import { useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'

export default function NoticiaDetalle(){
  const { slug } = useParams(); const [post,setPost]=useState(null)
  useEffect(()=>{ api(`/api/news/posts/${slug}/`).then(setPost) },[slug])
  if(!post) return <main className='container'><p>Cargando…</p></main>
  return (<main className='container'>
    {post.hero_image && <Reveal className='card'><img src={post.hero_image} alt={post.title}/></Reveal>}
    <Reveal as='h1'>{post.title}</Reveal>
    <Reveal className='card' delay={80}><div className='body'><div dangerouslySetInnerHTML={{__html:post.content}}/></div></Reveal>
    {post.end_image && <Reveal className='card' delay={120}><img src={post.end_image} alt='Imagen final'/></Reveal>}
  </main>)
}
