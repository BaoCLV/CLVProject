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
import EChartsReactCore from 'echarts-for-react/lib/core';
import world from '@/src/animations/world.json'; // World geoJSON
import ReactEchart from './ReactEhart'; // Assuming you have a wrapper around ECharts
import { GET_ROUTES_QUERY } from '@/src/graphql/route/Action/getRoutes.action';
import { getCountryByCity } from '@/src/libs/geolocation'; // Geolocation utility

echarts.use([TooltipComponent, GeoComponent, MapChart, CanvasRenderer]);
// @ts-ignore
echarts.registerMap('world', { geoJSON: world });

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GeoComponentOption | MapSeriesOption
>;

interface Route {
  startLocation: string;
  endLocation: string;
}

interface SalesMappingChartProps {
  salesMappingChartRef: MutableRefObject<EChartsReactCore | null>;
  routes: Route[];
  style?: {
    height?: number;
    width?: number | string;
  };
  minZoomLevel: number;
  maxZoomLevel: number;
  sx?: SxProps;
}

const SalesMappingChart = ({
  salesMappingChartRef,
  routes,
  style,
  minZoomLevel,
  maxZoomLevel,
  ...props
}: SalesMappingChartProps) => {
  const theme = useTheme();
  const [countries, setCountries] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCountries = async () => {
      const allCities = new Set<string>();
      routes.forEach((route) => {
        if (route.startLocation) allCities.add(route.startLocation);
        if (route.endLocation) allCities.add(route.endLocation);
      });

      const fetchPromises = Array.from(allCities).map((city) =>
        getCountryByCity(city).catch((error) => {
          console.error(`Failed to fetch country for city ${city}`, error);
          return null;
        })
      );

      const fetchedCountries = await Promise.all(fetchPromises);
      const countrySet = new Set<string>();
      fetchedCountries.forEach((country) => {
        if (country) countrySet.add(country);
      });
      setCountries(countrySet);
    };

    fetchCountries();
  }, [routes]);

  const salesMappingChartOption = useMemo(() => {
    if (!countries || countries.size === 0) return {};

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
        formatter: (params: any) => `${params.name}`, // Tooltip with country name
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
  }, [theme, countries, minZoomLevel, maxZoomLevel]);

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
