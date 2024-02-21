const ProductLabel = () => {
  return (
      <div className="flex flex-col">
          <div className="flex flex-row text-zinc-400">
            <span className="mr-1">SOLAR</span>
            <strong>SIM</strong>
          </div>
          <div className="self-end">
            <span className="px-1 text-center bg-zinc-400 rounded text-black">fx-GPT</span>
          </div>
      </div>
  );
}

export default ProductLabel;
