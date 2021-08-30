import { useRef, useEffect , useState} from 'react';
import { select } from "d3"

function HookTutorial() {
  const [data, setData] = useState([25, 30, 45, 60, 20]);
  const svgRef = useRef();

  // Called initially (when DOM elements rendered, or items in [] updated)
  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("circle").data(data).join(
      enter => enter.append("circle")
        .attr("r", value => value),
      update => update.attr("class", "updated"),
      exit => exit.remove()
    )
      .attr("r", value => value)
      .attr("cx", value => value * 2)
      .attr("cy", value => value * 2)
      .attr("stroke", "red")

  }, [data])

  return (
    <div>
      <svg ref={svgRef}></svg>
      <button onClick={() => setData(data.map(value => value + 5))}>Update data</button>
      <button onClick={() => setData(data.filter(value => value <= 100))}>Filter data</button>
    </div>
  );
}

export default HookTutorial;
