import useReveal from '../hooks/useReveal'
export default function Reveal({children, delay=0, as='div', className=''}){
  const Comp = as; const ref = useReveal(delay)
  return <Comp ref={ref} className={`reveal ${className}`}>{children}</Comp>
}
