import * as React from "react";

interface IStationProps {
	readonly name: string,
}

export interface IStationListProps {
	readonly stations: ReadonlyArray<IStationProps>
}

const StationList = (props: IStationListProps) => (
	<ul>
		{props.stations.map(station => (
			<li>
				{station.name}
			</li>
		))}
	</ul>
);

export default StationList;