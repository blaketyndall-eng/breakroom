import type { DirectoryCategory } from '@/lib/sleepnetPortal';

type Props = {
  categories: DirectoryCategory[];
};

export default function DirectoryCategories({ categories }: Props) {
  if (!categories.length) {
    return (
      <section className="old-shell directory-categories">
        <div className="old-header">Directory / No Categories</div>
        <div className="old-body">
          <p>The directory has no categories. It had them once. It does not discuss what happened.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="old-shell directory-categories">
      <div className="old-header">Directory / By District</div>
      <div className="old-body">
        <table className="directory-categories-table">
          <thead>
            <tr>
              <th>District</th>
              <th>Pages</th>
              <th>Sample</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.slug}>
                <td className="directory-district-name">{cat.label}</td>
                <td>{cat.count}</td>
                <td>
                  {cat.sample ? (
                    <a href={`/sleepnet/${cat.sample.slug}`}>{cat.sample.title}</a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
