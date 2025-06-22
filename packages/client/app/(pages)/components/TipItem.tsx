import React from 'react'

interface ITipItem {
  title: string
  text: string
  image: string
}

const TipItem: React.FC<ITipItem> = ({ title, text, image }) => {
  return (
    <div className="w-full lg:h-screen flex flex-col items-start gap-2">
      <div>
        <h2 className="font-ubuntu text-2xl font-medium text-white">{title}</h2>
        <h3 className="font-ubuntu text-lg text-el-inverse-primary">{text}</h3>
      </div>
      <img
        src={image}
        alt="screenshot"
        className="lg:w-[70%] w-full h-auto object-contain self-center"
      />
    </div>
  )
}
export default TipItem
