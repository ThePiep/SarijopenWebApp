interface Props {
  className?: React.ComponentProps<'div'>['className'];
  left: React.ReactElement;
  middle?: React.ReactElement;
  right: React.ReactElement;
}

export const LeftMiddleRight = ({ left, middle, right, className }: Props) => {
  return (
    <div className={`flex  ${className}`}>
      <div className='flex-1 flex whitespace-nowrap'>{left}</div>
      {middle && <div className='whitespace-nowrap'>{middle}</div>}
      <div className='flex-1 flex whitespace-nowrap justify-end'>{right}</div>
    </div>
  );
};
