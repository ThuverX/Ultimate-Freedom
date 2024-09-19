import { ThemeProvider } from './components/theme-provider'
import { Carousel, CarouselContent, CarouselItem, useCarousel } from '@/components/ui/carousel'
import { useEffect, useState } from 'react'
import { Button } from './components/ui/button'

const WeaponCarousel = ({ index, obj }: { index: number; obj: Record<string, string> }) => {
    const carousel = useCarousel()
    const length = Object.keys(obj).length

    useEffect(() => {
        carousel.api?.scrollTo(index)
    }, [index])

    return (
        <>
            {new Array(3).fill(0).map((_, highidx) =>
                Object.entries(obj).map(([name, img], lowidx) => (
                    <CarouselItem className="max-h-64 flex items-center justify-center relative" key={name + highidx}>
                        <img src={img} alt={name} className="object-fill w-full" />
                        <div className="absolute  inset-0 flex items-center justify-center">
                            {highidx * length + lowidx == index + 1 && (
                                <h2 className="text-3xl bg-black/60 p-4 text-[#ffe900] font-semibold tracking-tight first:mt-0">
                                    {name}
                                </h2>
                            )}
                        </div>
                    </CarouselItem>
                ))
            )}
        </>
    )
}

const Car = ({ children }: { children: any }) => {
    return (
        <div className="relative">
            <Carousel
                opts={{
                    duration: 16,
                    watchDrag: false
                }}>
                <CarouselContent className="w-1/3">{children}</CarouselContent>
            </Carousel>
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-background to-background/70"></div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-r from-background/70 to-background"></div>
        </div>
    )
}

import logo from './assets/Helldivers_2_29.webp'

function App() {
    const [data, setData] = useState<any>(null)
    const [primaryIndex, setPrimaryIndex] = useState(0)
    const [sidearmIndex, setSidearmIndex] = useState(0)
    const [grenadeIndex, setGrenadeIndex] = useState(0)

    const doRoll = () => {
        if (!data) return
        setPrimaryIndex(
            Math.floor(Math.random() * Object.keys(data.primaries).length) + Object.keys(data.primaries).length + 1
        )
        setSidearmIndex(
            Math.floor(Math.random() * Object.keys(data.sidearms).length) + Object.keys(data.sidearms).length + 1
        )
        setGrenadeIndex(
            Math.floor(Math.random() * Object.keys(data.grenades).length) + Object.keys(data.grenades).length + 1
        )
    }

    useEffect(() => {
        fetch('constants.json')
            .then((r) => r.json())
            .then(setData)
    }, [])

    useEffect(doRoll, [data])

    if (!data) return <></>

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex flex-col gap-4 m-20 w-[80vw]">
                <h1 className="scroll-m-20 text-4xl font-extrabold flex tracking-tight lg:text-5xl text-[#ffe900]">
                    <img className="h-12 mr-4" src={logo} />
                    Ultimate Freedom
                </h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6">A Helldivers 2 random loadout generator.</p>
                <div className="flex">
                    <Button className="px-20" size="lg" onClick={doRoll}>
                        Roll
                    </Button>
                </div>
                <Car>
                    <WeaponCarousel index={primaryIndex} obj={data.primaries} />
                </Car>
                <Car>
                    <WeaponCarousel index={sidearmIndex} obj={data.sidearms} />
                </Car>
                <Car>
                    <WeaponCarousel index={grenadeIndex} obj={data.grenades} />
                </Car>
            </div>
        </ThemeProvider>
    )
}

export default App
