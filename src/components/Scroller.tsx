
interface ScrollerProps {
  text: string;
  items: string[];
  limit?: number;
}

export default function Scroller({ text, items = [], limit = 20 }: ScrollerProps) {
  return (
    <>
      <span className="font-semibold">{ text }</span>
    
      <div className="w-110 inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
        <ul className="animate-infinite-scroll flex items-center justify-center md:justify-start [&_li]:mx-8 [&_li]:text-nowrap [&_img]:max-w-none">
          { items.slice(0, limit).map((item) => <li key={ item }>{ item }</li> )}
        </ul>
        <ul className="animate-infinite-scroll flex items-center justify-center md:justify-start [&_li]:mx-8 [&_li]:text-nowrap [&_img]:max-w-none" aria-hidden="true">
          { items.slice(0, limit).map((item) => <li key={ item }>{ item }</li> )}
        </ul>
      </div>
    </>
  )
}