import { ChevronDown } from "lucide-react"

export default function DateFilter() {
    return (
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <span>Fechas</span>
            <ChevronDown className="h-4 w-4" />
        </button>
    )
}

