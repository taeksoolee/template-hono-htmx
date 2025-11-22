import type { FC, PropsWithChildren } from 'hono/jsx';
import DefaultLayout from '../../../layouts/default.js';

export interface AboutMeProps {

}

const AboutMe: FC<PropsWithChildren<AboutMeProps>> = () => {
  return (
    <DefaultLayout title="AboutMe">
      <div>
        AboutMe Page
      </div>
    </DefaultLayout>
  )
}

export default AboutMe;