import Reveal from '../components/Reveal'
export default function QuienesSomos(){
  return (
    <main className="container">
      <Reveal as='h1'>¿Quiénes somos?</Reveal>
      <Reveal as='p' delay={80}>
        Somos una ONG que acompaña a niñas en su etapa menstrual con educación,
        productos y seguimiento.
      </Reveal>
    </main>
  )
}
