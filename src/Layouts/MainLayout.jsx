import React from 'react'

function MainLayout({ children }) {
  return (
    <div className='mt-[110px]   ml-4 h-[560px] overflow-hidden w-[98%] border border-gray-200 rounded-md'>
       {children}
    </div>
  )
}

export default MainLayout
