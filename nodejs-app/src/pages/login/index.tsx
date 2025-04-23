import type { FC, PropsWithChildren } from 'hono/jsx';
import DefaultLayout from '../../layouts/default.js';

export interface LoginProps {

}

const Login: FC<PropsWithChildren<LoginProps>> = () => {
  return (
    <DefaultLayout title="Login">
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-4">

              <h1 class="title has-text-centered">Login</h1>

              <form 
                hx-post="/login" 
                hx-target="#login-message" 
                hx-swap="innerHTML" 
                class="box"
              >
                <div class="field">
                  <label class="label">Username</label>
                  <div class="control has-icons-left">
                    <input class="input" type="text" name="email" placeholder="e.g. user" required />
                    <span class="icon is-small is-left">
                      <i class="fas fa-user"></i>
                    </span>
                  </div>
                </div>

                <div class="field">
                  <label class="label">Password</label>
                  <div class="control has-icons-left">
                    <input class="input" type="password" name="password" placeholder="********" required />
                    <span class="icon is-small is-left">
                      <i class="fas fa-lock"></i>
                    </span>
                  </div>
                </div>

                <div class="field">
                  <div class="control">
                    <button class="button is-primary is-fullwidth" type="submit">Login</button>
                  </div>
                </div>
              </form>

              <div id="login-message" class="has-text-centered mt-3">
                {/*  */}
              </div>

            </div>
          </div>
        </div>
      </section>

    </DefaultLayout>
  )
}

export default Login;