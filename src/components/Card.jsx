import React from 'react'

function Card({heading, count}) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-700">{heading}</h2>
            <p className="text-2xl text-navy-blue-600">{count}</p>
        </div>
    )
}

export default Card