export const Button =({onClick , children}:{onClick:()=>void , children:React.ReactNode})=>
    {
    return <button onClick= {onClick} className="px-6 py-3 text-2xl bg-green-500
     hover:bg-green-700 text-white font-bold rounded">
        {children}
    </button>
}