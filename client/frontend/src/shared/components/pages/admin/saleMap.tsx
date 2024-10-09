import { useQuery } from '@apollo/client';
import { SxProps, useTheme } from '@mui/material';
import { MutableRefObject, useEffect, useMemo, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  GeoComponent,
  GeoComponentOption,
} from 'echarts/components';
import { MapChart, MapSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { CallbackDataParams } from 'echarts/types/src/util/types.js';
import EChartsReactCore from 'echarts-for-react/lib/core';
import world from '@/src/animations/world.json';
import ReactEchart from './ReactEhart';
import { GET_ROUTES_QUERY } from '@/src/graphql/route/Action/getRoutes.action';
import { getCountryByCity } from '@/src/libs/geolocation';

echarts.use([TooltipComponent, GeoComponent, MapChart, CanvasRenderer]);
//@ts-ignore
echarts.registerMap('world', { geoJSON: world });

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GeoComponentOption | MapSeriesOption
>;

interface SalesMappingChartProps {
  salesMappingChartRef: MutableRefObject<EChartsReactCore | null>;
  style?: {
    height?: number;
    width?: number;
  };
  minZoomLevel: number;
  maxZoomLevel: number;
  sx?: SxProps;
}

const SalesMappingChart = ({
  salesMappingChartRef,
  style,
  minZoomLevel,
  maxZoomLevel,
  ...props
}: SalesMappingChartProps) => {
  const theme = useTheme();
  const [countries, setCountries] = useState<Set<string>>(new Set());

  // GraphQL query to fetch startLocation and endLocation
  const { loading, error, data } = useQuery(GET_ROUTES_QUERY, {
    variables: { query: "" },
  });

  // Fetch countries by cities concurrently
  useEffect(() => {
    const fetchCountries = async () => {
      if (data) {
        const allCities = new Set<string>();

        // Collect all unique cities (startLocation and endLocation)
        data.routes.forEach((route: any) => {
          if (route.startLocation) allCities.add(route.startLocation);
          if (route.endLocation) allCities.add(route.endLocation);
        });

        // Fetch all country data concurrently using Promise.all
        const fetchPromises = Array.from(allCities).map((city) =>
          getCountryByCity(city).catch((error) => {
            console.error(`Failed to fetch country for city ${city}`, error);
            return null;
          })
        );

        const fetchedCountries = await Promise.all(fetchPromises);

        // Filter and add only unique countries to the set
        const countrySet = new Set<string>();
        fetchedCountries.forEach((country) => {
          if (country) countrySet.add(country);
        });

        setCountries(countrySet); // Update state with unique countries
      }
    };

    fetchCountries();
  }, [data]);

  // Process the locations into a format for ECharts
  const salesMappingChartOption = useMemo(() => {
    if (!countries || countries.size === 0) return {};

    // Prepare the data for ECharts, highlighting countries
    const chartData = Array.from(countries).map((country) => ({
      name: country,
      value: 1,
      itemStyle: {
        areaColor: theme.palette.success.main, 
      },
    }));

    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: (params: CallbackDataParams) => {
          const { name } = params;
          return `${name}`;
        },
      },
      series: [
        {
          type: 'map',
          map: 'world',
          data: chartData,
          roam: true,
          scaleLimit: {
            min: minZoomLevel,
            max: maxZoomLevel,
          },
          itemStyle: {
            areaColor: theme.palette.grey.A700,
            borderColor: theme.palette.common.white,
            borderWidth: 0.2,
          },
        },
      ],
    };
    return option;
  }, [theme, countries]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ReactEchart
      echarts={echarts}
      option={salesMappingChartOption}
      ref={salesMappingChartRef}
      style={style}
      {...props}
    />
  );
};

export default SalesMappingChart;
