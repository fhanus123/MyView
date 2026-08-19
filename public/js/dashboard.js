const tableBody = document.getElementById('accountTableBody');
const errorDiv = document.getElementById('errorMessage');

let errorTimeout;

function showError(message) {
  clearTimeout(errorTimeout);
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden', 'hide');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      errorDiv.classList.add('show');
    });
  });
  errorTimeout = setTimeout(() => hideError(), 4000);
}

function hideError() {
  errorDiv.classList.remove('show');
  errorDiv.classList.add('hide');
  setTimeout(() => {
    errorDiv.classList.add('hidden');
    errorDiv.classList.remove('hide');
  }, 300);
}

// Format tanggal jadi lebih mudah dibaca
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

async function loadAccounts() {
  const res = await fetch('/api/auth/accounts');
  const data = await res.json();

  if (!res.ok) {
    showError(data.error);
    return;
  }

  tableBody.innerHTML = '';

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="text-gray-400 text-sm text-center py-4">Belum ada akun terdaftar.</td></tr>`;
    return;
  }

  data.forEach((account) => {
    const row = document.createElement('tr');
    const roleBadge = account.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';

    row.innerHTML = `
      <td class="py-2 border-b border-gray-100">${account.id}</td>
      <td class="py-2 border-b border-gray-100">${account.username}</td>
      <td class="py-2 border-b border-gray-100">
        <span class="text-xs px-2 py-1 rounded-full ${roleBadge}">${account.role}</span>
      </td>
      <td class="py-2 border-b border-gray-100 text-sm text-gray-500">${formatDate(account.created_at)}</td>
      <td class="py-2 border-b border-gray-100 space-x-2">
        <button class="reset bg-amber-500 hover:bg-amber-600 text-white text-xs px-2 py-1 rounded">Reset Password</button>
        <button class="delete bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded">Hapus</button>
      </td>
    `;

    row.querySelector('.reset').addEventListener('click', async() => {
      const newPassword = prompt(`Masukan password baru untuk "${account.username}" (minimal 6 karakter)`);

      if(newPassword == null) {
        return;
      }
      if(newPassword.length < 6) {
        showError('password anda minimal 6 karakter');
        return;
      }

      const res = await fetch(`/api/auth/accounts/${account.id}/reset-password`, {
        method : 'put',
        headers : {'content-type': 'application/json'},
        body : JSON.stringify({newPassword}),
      });

      const data = await res.json();

      if(!res.ok) {
        showError(data.error);
        return;
      }

      alert(`Password untuk "${account.username}" Berhasil di reset`);
    });

    row.querySelector('.delete').addEventListener('click', async () => {
      if(!confirm(`Yakin ingin menghapus akun "${account.username}"? ini juga menghapus semua todo list dari akun ini`)) {
        return;
      }
      
      const res = await fetch(`./api/auth/accounts/${account.id}`, {method : 'DELETE'});
      const data = await res.json();

      if(!res.ok) {
        showError(data.error);
        return;
      }

    loadAccounts();
    });

    tableBody.appendChild(row);
  });
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
});

loadAccounts();