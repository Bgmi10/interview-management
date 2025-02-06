import axios from "axios";

export default async function Main() {
    const data: any = await axios.get('https://dummyjson.com/products')

    return (
        <div>
            { data.data.products.map((item: any) => (
                <div key={item.id} className="text-black">
                 { item.title }
                </div>
            ))}
        </div>
    )
}