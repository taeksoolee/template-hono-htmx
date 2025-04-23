import type { FC, PropsWithChildren } from 'hono/jsx';
import DefaultLayout from '../../../../layouts/default.js';

export interface AboutMeProps {

}

const AboutMeAndYou: FC<PropsWithChildren<AboutMeProps>> = () => {
  return (
    <DefaultLayout title="AboutMeAndYou">
      <div>
        AboutMeAndYou Page
      </div>
    </DefaultLayout>
  )
}

export default AboutMeAndYou;