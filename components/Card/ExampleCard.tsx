import { Card, CardProps } from "./Card"


export const ExampleCard = ({ ...props }: Omit<CardProps, 'children'>) => {
  return (
    <Card {...props}>
      <p className="text-ellipsis">If a dog chews shoes whose shoes does he choose?</p>
      <div className="card-actions justify-end">
      </div>
    </Card>
  )
}