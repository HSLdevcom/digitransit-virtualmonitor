import * as React from "react";

interface IStationProps {
	name: string,
};

export interface IStationListProps {
	stations: IStationProps[]
};

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