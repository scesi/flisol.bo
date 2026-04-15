// Contributor type for props
export type Network = {
  network_name: string;
  username: string;
  url: string;
};

export type Contributor = {
  name: string;
  role: string;
  networks: Network[];
};
