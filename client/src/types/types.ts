  interface ICamper {
    id: number;
    title: string;
    description: string;

    shelterCount: number,
    camperCount: number,
    eCoordinates: string,
    wCoordinates: string,
    data: string,
    rate: number,
    img: string,
    img2: string,
    img3: string,
    camperPrice: number,
    shelterPrice: number,
  }

  interface IRoute{
    id: number,
    title: string,
    type: string,
    img: string,
  }


  export type CamperType = Array<ICamper>;
  export type RouteType = Array<IRoute>
  
  export type { ICamper, IRoute }
  