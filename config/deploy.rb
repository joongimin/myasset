lock('~> 3.13.0')

set(:application, 'myasset')
set(:repo_url, 'git@github.com:joongimin/myasset.git')
set(:deploy_to, "~/#{fetch(:application)}")
