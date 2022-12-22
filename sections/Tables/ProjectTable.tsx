import { ColumnDef, FilterFn} from '@tanstack/react-table';
import Address from '../../components/functional/Address';
import { useQuery } from '@tanstack/react-query';
import { UniService } from '../../services/DapAPIService';
import { useMemo, useState } from 'react';
import { AddCol, ImageHover, ActionCol, TableWrapper } from '../../components/tables/TableStyles';
import {  RewardIcon, VerifiedIcon } from '../../components/icons/Common';
import { ChainIconComponent } from '../../helpers/MultichainHelpers';
import RewardTable from '../../components/tables/RewardTable';
import { Col, RowCenter } from '../../components/format/Row';
import { useTheme } from 'styled-components';
import { SubcatPick } from '../../components/functional/CatPicks';
import TableSkeleton from '../../components/skeletons/TableSkeleton';
import { Project } from '../../types/project';
import { filterInputs } from '../../util/constants';
import { ArrElement } from '../../types/common';
import BalanceProjectSmall from '../../components/functional/BalanceProjectSmall';
import Tooltip from '../../components/Tooltip';
import { AbsoluteRight } from '../../components/format/Box';
import TableComponent from '../../components/tables/TableComponent';
import ProjectActions from '../../components/tables/ProjectActions';


declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends unknown, TValue> {
    filter: ArrElement<typeof filterInputs>;
  }
}

const filterChains: FilterFn<Project> = (row, columnId, value) => row.getValue(columnId).toString().includes(value);

const ProjectTable = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [projectId, setProjectId] = useState<string | undefined>();
  const theme = useTheme();


  const handleTooltip = (text: string) => {
    setShowTooltip(true);
    setTooltipText(text);
  }


  const columns = useMemo<ColumnDef<Project, string>[]>(
    () => [
      {
        accessorKey: 'chainId',
        cell: (props) => <ChainIconComponent ch={props.getValue()} />,
         //@ts-ignore
        header: <div onMouseEnter={() => { handleTooltip('Supported chains: Polygon, BNB, Optimism, Fantom') }} onMouseLeave={() => { setShowTooltip(false) }}>Ch</div>,
        enableSorting: false,
        meta: {
          filter: 'select',
        },
        enableColumnFilter: true,
        filterFn: filterChains,
      },
      {
        accessorKey: 'title',
        header: 'Project',
        cell: (props) => (
          <RowCenter>
            <b>{props.getValue()}</b>
            <AbsoluteRight>
              {props.row.original.verified && <VerifiedIcon height={15} width={15} color={theme.colors.icon} />}
            </AbsoluteRight>
          </RowCenter>
        ),
        enableColumnFilter: true,
        enableSorting: false,
      },
      {
        accessorKey: 'owner',
        cell: (props) => (
          <AddCol>
            <Address address={props.getValue()} />
          </AddCol>
        ),
        header: 'Owner',
        enableColumnFilter: true,
        enableSorting: false,
      },
      {
        accessorKey: 'pid',
        cell: (props) => <BalanceProjectSmall pid={props.getValue()} chainId={props.row.original.chainId} />,
        //@ts-ignore
        header: <Col>
          <>Goal</>
        </Col>,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'category',
        cell: (props) => <>{props.getValue()}</>,
        header: 'Category',
        enableSorting: false,
        meta: {
          filter: 'select',
        },
      },
      {
        accessorKey: 'subcategory',
        cell: (props) => <SubcatPick width={40} subcat={props.getValue()} />,
        header: 'Area',
        meta: {
          filter: 'select',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'objectId',
        cell: (props) => (
          <RowCenter>
            <ProjectActions project={props.row.original.objectId} website={props.row.original.urlProject} socials={props.row.original.urlSocials}/>
            <ImageHover onClick={() => {handleReward(props.getValue())}}>            
              <RewardIcon height={30} color={theme.colors.icon} width={20} />
            </ImageHover>
          </RowCenter>
        ),
         //@ts-ignore
        header: <ActionCol>Actions</ActionCol>,
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    []
  );

  const { data, isLoading } = useQuery<Project[]>(['projects'], () => UniService.getDataAll(`/classes/Project?where={"state": 1, "type": "Standard"}`), {
    onError: (err) => {
      console.log('err', err);
    }
  });

  const { data: projectRewards } = useQuery(
    ['rewards', projectId],
    () => UniService.getDataAll(`/classes/Reward?where={"project":"${projectId}"}`),
    {
      onError: (err) => {
        console.log('err', err);
      },
      enabled: !!projectId,
    }
  );

  const handleReward = (id: string) => {
    setProjectId(id);
  };


  return (
    <TableWrapper>
      {isLoading ? (
        <TableSkeleton/>
      ) : (
        <Col>
          {showTooltip && <Tooltip margin={undefined} text={tooltipText} />}
          <TableComponent type={'project'} columns={columns} data={data}/>
        </Col>
      )}
      {projectRewards && <RewardTable data={projectRewards}  projectId={projectId} />}
    </TableWrapper>
  );
};

export default ProjectTable;
