import { useEffect, useState } from "react";

interface Settings {
	maxPlayers: number;
	imposters: number;
}

type SettingsProps = {
	gameId: string;
	name: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export default function Settings({ gameId, name }: SettingsProps) {
	const [settings, setSettings] = useState<Settings>();
	const [fetchTrigger, setFetchTrigger] = useState(false);
	useEffect(() => {
		fetch(`http://${apiUrl}:4000/settings/` + gameId, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (!response.ok) {
					console.log("error");
					throw new Error("Failed to fetch settings");
				}
				console.log(response);
				return response.json();
			})
			.then((json) => {
				console.log(json);
				setSettings({
					maxPlayers: json.maxPlayers,
					imposters: json.imposters,
				});
			});
	}, [gameId, fetchTrigger]);

	function handleChange(id: string, e: any) {
		let s = settings;
		if (id === "maxPlayers") {
			if (s !== undefined) {
				s.maxPlayers += 1;
			} else {
				s = {
					maxPlayers: 10,
					imposters: 2,
				};
			}

			setSettings({
				maxPlayers: e.target.value,
				imposters: s.imposters,
			});
		}

		if (id === "imposters") {
			if (s !== undefined) {
				s.imposters += 1;
			} else {
				s = {
					maxPlayers: 10,
					imposters: 2,
				};
			}

			setSettings({
				maxPlayers: s.maxPlayers,
				imposters: e.target.value,
			});
		}

		fetch(
			`http://${apiUrl}:4000/settings/${gameId}/${name}/${id}/${e.target.value}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			}
		).then((response) => {
			console.log("ok");
			if (response.ok) {
				if (id === "maxPlayers") {
					setSettings({
						maxPlayers: e.target.value,
						imposters: settings?.imposters ?? 1,
					});
				}

				if (id === "imposters") {
					setSettings({
						maxPlayers: settings?.maxPlayers ?? 3,
						imposters: e.target.value,
					});
				}
			}
		});
	}
	//p-4 rounded-md bg-blue-600 fixed bottom-5 right-5 flex flex-row items-end space-y-2
	return (
		<div className="absolute top-5 left-5 bg-blue-600 p-4 rounded-md">
			<div key={"maxPlayers"}>
				<p className="text-white mb-1">Max Players</p>
				<input
					className="rounded-md p-1 pl-2 bg-blue-400 text-white"
					onChange={(e) => handleChange("maxPlayers", e)}
					type="number"
					value={settings?.maxPlayers ?? 3}
				></input>
			</div>

			<div className="mt-2" key={"imposters"}>
				<p className="text-white mb-1">Imposters</p>
				<input
					className="rounded-md p-1 pl-2 bg-blue-400 text-white"
					onChange={(e) => handleChange("imposters", e)}
					type="number"
					value={settings?.imposters ?? 1}
				></input>
			</div>
		</div>
	);
}
