const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md p-2 text-sm shadow-lg bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700">
        <p className="font-medium">{label}</p>
        <p>Price: ₹{payload[0].value}</p>
      </div>
    );
  }

  return null;
};
export default CustomTooltip;
