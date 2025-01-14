/** @format */

// /** @format */

// import axios from "axios";

// interface AxiosResponse {
// 	url: string;
// 	method: string;
// 	body: object;
// 	headers: object;
// 	params: object;
// }

// export const useAxios = () => {
// 	const response = ({ url, method = "GET", body, headers, params }: AxiosResponse) => {
// 		axios({
// 			url: `${import.meta.env.VITE_API_URL}${url}`,
// 			method,
// 			data: body,
// 			headers: {
// 				"Content-Type": "application/json",
// 				"Accsess-Control-Allow-Origin": true,
// 				...headers,
// 			},
// 			params: {
// 				access_token: "64bebc1e2c6d3f056a8c85b7",
// 				...params,
// 			},
// 		})
// 			.then((res) => {
// 				return res.data;
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 			});
// 	};

// 	return response;
// };

import axios from "axios";

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	params: {
		access_token: "64bebc1e2c6d3f056a8c85b7"
	}
});

interface AxiosProps {
	url: string;
	method: string;
	body?: object;
	headers?: object;
	params?: object;
}

export const useAxios = () => {
	const response = async ({ url, method = "GET", body, headers, params }: AxiosProps) => {
		try {
			const res = await instance({
				url,
				method,
				data: body,
				headers: {
					"Content-Type": "application/json",
					...headers,
				},
				params: {
					...params
				},
			});
			return res.data;
		} catch (err) {
			console.log("API Error:", err);
			throw err;
		}
	};

	return response;
};
